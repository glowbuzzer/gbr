/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import { ACTIVITYSTATE, MoveParametersConfig, SPINDLEDIRECTION, STREAMSTATE } from "../../gbc"
import {
    AoutBuilder,
    CancelActivityBuilder,
    DoutBuilder,
    DwellActivityBuilder,
    EndProgramBuilder,
    IoutBuilder,
    MoveArcBuilder,
    MoveJointsAtVelocityBuilder,
    MoveJointsBuilder,
    MoveLineBuilder,
    MoveRotationAtVelocityBuilder,
    MoveToPositionBuilder,
    MoveVectorAtVelocityBuilder,
    PauseProgramBuilder,
    SpindleActivityBuilder,
    ToolOffsetBuilder
} from "./builders"

// some functions can take null as a parameter to indicate that current value should be used (eg. xyz position on move)
function nullify(v?: number) {
    return v === null || isNaN(v /* null is not NaN */) ? null : v
}

/** @ignore */
export abstract class ActivityApiBase {
    /** @ignore */
    public readonly kinematicsConfigurationIndex: number
    private readonly defaultMoveParameters: MoveParametersConfig

    protected constructor(
        kinematicsConfigurationIndex: number,
        defaultMoveParameters: MoveParametersConfig
    ) {
        this.kinematicsConfigurationIndex = kinematicsConfigurationIndex
        this.defaultMoveParameters = defaultMoveParameters
    }

    /** @ignore */
    abstract get nextTag(): number

    /** @ignore */
    abstract execute(command)

    dwell(ticksToDwell: number) {
        return new DwellActivityBuilder(this).ticksToDwell(ticksToDwell)
    }

    moveArc(x?: number, y?: number, z?: number) {
        return new MoveArcBuilder(this)
            .params(this.defaultMoveParameters)
            .translation(nullify(x), nullify(y), nullify(z))
    }

    moveJoints(jointPositionArray: number[]) {
        return new MoveJointsBuilder(this)
            .params(this.defaultMoveParameters)
            .joints(jointPositionArray)
    }

    moveJointsAtVelocity(jointVelocityArray: number[]) {
        return new MoveJointsAtVelocityBuilder(this)
            .params(this.defaultMoveParameters)
            .velocities(jointVelocityArray)
    }

    moveLine(x?: number, y?: number, z?: number) {
        return new MoveLineBuilder(this)
            .params(this.defaultMoveParameters)
            .translation(nullify(x), nullify(y), nullify(z))
    }

    moveVectorAtVelocity(x: number, y: number, z: number) {
        return new MoveVectorAtVelocityBuilder(this)
            .params(this.defaultMoveParameters)
            .vector(x, y, z)
    }

    moveRotationAtVelocity(x: number, y: number, z: number) {
        return new MoveRotationAtVelocityBuilder(this)
            .params(this.defaultMoveParameters)
            .axis(x, y, z)
    }

    moveToPosition(x?: number, y?: number, z?: number) {
        return new MoveToPositionBuilder(this)
            .params(this.defaultMoveParameters)
            .translation(nullify(x), nullify(y), nullify(z))
    }

    setDout(index: number, value: boolean) {
        return new DoutBuilder(this).dout(index).value(value)
    }

    setAout(index: number, value: number) {
        return new AoutBuilder(this).aout(index).value(value)
    }

    setIout(index: number, value: number) {
        return new IoutBuilder(this).iout(index).value(value)
    }

    setToolOffset(toolIndex: number): ToolOffsetBuilder {
        return new ToolOffsetBuilder(this).toolIndex(toolIndex)
    }

    spindle(
        spindleIndex,
        enable?: boolean,
        speed?: number,
        direction?: SPINDLEDIRECTION
    ): SpindleActivityBuilder {
        return new SpindleActivityBuilder(this)
            .spindleIndex(spindleIndex)
            .enable(enable)
            .speed(speed)
            .direction(direction)
    }
}

/**
 * @ignore
 */
export abstract class ActivityApiBaseWithPromises extends ActivityApiBase {
    /** @ignore */
    protected currentTag = 1
    private promiseFifo: { tag: number; resolve; reject }[] = []

    /** @ignore */
    protected createPromise(tag: number, send: () => void): Promise<number> {
        return new Promise((resolve, reject) => {
            this.promiseFifo.push({ tag, resolve, reject })
            send()
        })
    }

    /** @ignore */
    updateActivity(tag: number, state: ACTIVITYSTATE) {
        if (!this.currentTag) {
            this.currentTag = tag + 1
        }
        const { promiseFifo } = this
        while (promiseFifo.length && promiseFifo[0].tag < tag) {
            // resolve any old activities that have been superceded by a later tag
            promiseFifo.shift()?.resolve({ tag, completed: false })
        }
        if (!promiseFifo.length) {
            // nothing to update
            return
        }

        if (state === ACTIVITYSTATE.ACTIVITY_COMPLETED) {
            const current = promiseFifo.shift()
            current?.resolve({ tag: current.tag, completed: true })
        } else if (state === ACTIVITYSTATE.ACTIVITY_CANCELLED) {
            const current = promiseFifo.shift()
            current?.resolve({ tag: current.tag, completed: false })
        }
    }

    /** @ignore */
    updateStream(tag: number, state: STREAMSTATE) {
        // we take a simple approach to stream handling...
        // if we are idle, then we can resolve any pending promises
        // if we are not idle, then we can only resolve promises that are older than the current tag
        const { promiseFifo } = this

        while (
            promiseFifo.length &&
            (state === STREAMSTATE.STREAMSTATE_IDLE || promiseFifo[0].tag < tag)
        ) {
            // resolve any old activities that have been superceded by a later tag
            promiseFifo.shift()?.resolve({ tag, completed: true })
        }
    }
}
