/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import {
    ACTIVITYSTATE,
    ActivityStreamItem,
    MoveParametersConfig,
    SPINDLEDIRECTION,
    STREAMSTATE
} from "../../gbc"
import {
    ActivityPromiseResult,
    ActivityStreamItemBuilder,
    AoutBuilder,
    DoutBuilder,
    DwellActivityBuilder,
    ExternalDoutBuilder,
    ModbusDoutBuilder,
    ModbusUioutBuilder,
    ExternalIoutBuilder,
    ExternalUioutBuilder,
    IoutBuilder,
    MoveArcBuilder,
    MoveInstantBuilder,
    MoveJointsAtVelocityBuilder,
    MoveJointsBuilder,
    MoveJointsInterpolatedBuilder,
    MoveLineBuilder,
    MoveRotationAtVelocityBuilder,
    MoveToPositionBuilder,
    MoveVectorAtVelocityBuilder,
    SetPayloadBuilder,
    SpindleActivityBuilder,
    ToolOffsetBuilder,
    UioutBuilder
} from "./builders"
import { ActivityApi } from "./interface"

// some functions can take null as a parameter to indicate that current value should be used (eg. xyz position on move)
function nullify(v?: number) {
    return v === null || Number.isNaN(v /* null is not NaN */) ? null : v
}

/** @ignore */
export abstract class ActivityApiBase implements ActivityApi {
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
    abstract execute(command: any): any

    dwell(msToDwell: number) {
        return new DwellActivityBuilder(this).msToDwell(msToDwell)
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

    moveJointsInterpolated(
        duration: number,
        jointPositionArray: number[],
        jointVelocityArray: number[]
    ) {
        return new MoveJointsInterpolatedBuilder(this)
            .params(this.defaultMoveParameters)
            .duration(duration)
            .positions(jointPositionArray)
            .velocities(jointVelocityArray)
    }

    moveJointsAtVelocity(jointVelocityArray: number[]) {
        return new MoveJointsAtVelocityBuilder(this)
            .params(this.defaultMoveParameters)
            .velocities(jointVelocityArray)
    }

    moveLine(x?: number, y?: number, z?: number) {
        return (
            new MoveLineBuilder(this)
                // .params(this.defaultMoveParameters)
                .translation(nullify(x), nullify(y), nullify(z))
        )
    }

    moveInstant(x?: number, y?: number, z?: number) {
        return new MoveInstantBuilder(this)
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

    setExternalDout(index: number, value: boolean) {
        return new ExternalDoutBuilder(this).dout(index).value(value)
    }

    setModbusDout(index: number, value: boolean[]) {
        return new ModbusDoutBuilder(this).dout(index).value(value)
    }

    setAout(index: number, value: number) {
        return new AoutBuilder(this).aout(index).value(value)
    }

    setIout(index: number, value: number) {
        return new IoutBuilder(this).iout(index).value(value)
    }

    setUiout(index: number, value: number) {
        return new UioutBuilder(this).iout(index).value(value)
    }

    setExternalIout(index: number, value: number) {
        return new ExternalIoutBuilder(this).iout(index).value(value)
    }

    setExternalUiout(index: number, value: number) {
        return new ExternalUioutBuilder(this).iout(index).value(value)
    }

    setModbusUiout(index: number, value: number[]) {
        return new ModbusUioutBuilder(this).uiout(index).value(value)
    }

    setToolOffset(toolIndex: number): ToolOffsetBuilder {
        return new ToolOffsetBuilder(this).toolIndex(toolIndex)
    }

    setPayload(mass: number): SetPayloadBuilder {
        return new SetPayloadBuilder(this).mass(mass)
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

    from(activity: ActivityStreamItem): ActivityStreamItemBuilder {
        return new ActivityStreamItemBuilder(this, activity)
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
    protected createPromise(tag: number, send: () => void): Promise<ActivityPromiseResult> {
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
        const { promiseFifo } = this

        const idle = state === STREAMSTATE.STREAMSTATE_IDLE
        const stopped = state === STREAMSTATE.STREAMSTATE_STOPPED

        // if the stream is idle and the tag is zero, it indicates the stream was reset,
        // for example, because we dropped out of OP, in which case we reject any outstanding promises
        if (idle && tag === 0) {
            while (promiseFifo.length) {
                promiseFifo.shift()?.reject({ tag, completed: false })
            }
        }

        // stream is either active, complete or stopped
        // if active, we can resolve any promises up to the active tag
        // if complete (idle) we can resolve all promises
        // if stopped we can reject all promises
        while (promiseFifo.length && (idle || stopped || promiseFifo[0].tag < tag)) {
            if (stopped) {
                promiseFifo.shift()?.reject({ tag, completed: false })
            } else {
                promiseFifo.shift()?.resolve({ tag, completed: true })
            }
        }
    }
}
