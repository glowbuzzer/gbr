import {
    ACTIVITYSTATE,
    ACTIVITYTYPE,
    ARCDIRECTION,
    ARCTYPE,
    CartesianPositionsConfig,
    CartesianVector,
    DwellConfig,
    MoveArcStream,
    MoveLineStream,
    MoveParametersConfig,
    POSITIONREFERENCE,
    SetAoutCommand,
    SetDoutCommand,
    SetIoutCommand
} from "../gbc"
import { Vector3 } from "three"

const all_types = [
    "",
    "moveJoints",
    "moveJointsAtVelocity",
    "moveLine",
    "moveLineAtVelocity",
    "moveArc",
    "moveSpline",
    "moveToPosition",
    "moveLineWithForce",
    "moveToPositionWithForce",
    "gearInPos",
    "gearInVelo",
    "gearInDyn",
    "setDout",
    "setAout",
    "dwell",
    "waitOn",
    "switchPose",
    "latch",
    "stressTest",
    "endProgram",
    "setIout"
]

function make_activity(index: number, type: ACTIVITYTYPE, tag: number, params?) {
    const typeName = all_types[type]

    const command_detail =
        typeName.length && params
            ? {
                [typeName]: {
                    ...params
                }
            }
            : {}

    return {
        activityType: type,
        tag,
        ...command_detail
    }
}

export class ActivityApi {
    private readonly index: number
    private readonly send: (msg: string) => void
    private currentTag = 0
    private promiseFifo: { tag: number; resolve; reject }[] = []

    constructor(index: number, send: (msg: string) => void) {
        this.index = index
        this.send = send
    }

    buildFromCommand(tag: number, command) {
        const soloActivity = JSON.stringify({
            command: {
                soloActivity: {
                    [this.index]: {
                        command
                    }
                }
            }
        })

        return {
            promise: () => {
                return new Promise<void>((resolve, reject) => {
                    this.promiseFifo.push({ tag, resolve, reject })
                    this.send(soloActivity)
                })
            },
            tag,
            command
        }
    }

    buildMotion(type: ACTIVITYTYPE, params, moveParams) {
        const tag = this.currentTag++
        const command = make_activity(this.index, type, tag, {
            ...params,
            kinematicsConfigurationIndex: this.index,
            moveParams
        })
        return this.buildFromCommand(tag, command)
    }

    buildOther(type: ACTIVITYTYPE, params?) {
        const tag = this.currentTag++
        const message = make_activity(this.index, type, tag, params)
        return this.buildFromCommand(tag, message)
    }

    update(tag: number, state: ACTIVITYSTATE) {
        if (!this.currentTag) {
            this.currentTag = tag + 1
        }
        const { promiseFifo } = this
        while (promiseFifo.length && promiseFifo[0].tag < tag) {
            // reject any old activities that have been superceded by a later tag
            // console.log("REJECT OLD TAG", promiseFifo[0].tag)
            promiseFifo.shift()?.resolve({ tag, completed: false })
            // last.reject(last.tag)
        }
        if (!promiseFifo.length) {
            // nothing to update
            return
        }
        const lastTag = this.promiseFifo[0].tag
        // console.log("UPDATE ACTIVITY", tag, ACTIVITYSTATE[state], "LAST TAG", lastTag)

        if (state === ACTIVITYSTATE.ACTIVITY_COMPLETED) {
            // console.log("EXEC COMPLETE FOR TAG", tag)
            const current = promiseFifo.shift()
            current?.resolve({ tag: current.tag, completed: true })
        } else if (state === ACTIVITYSTATE.ACTIVITY_CANCELLED) {
            // console.log("EXEC CANCELLED FOR TAG", tag)
            const current = promiseFifo.shift()
            current?.resolve({ tag: current.tag, completed: false })
            // current?.reject(current.tag)
        } else {
            // console.log("TAG RUNNING BUT NOT COMPLETED", tag)
        }
    }

    cancel() {
        return this.buildMotion(ACTIVITYTYPE.ACTIVITYTYPE_NONE, {}, {})
    }

    dwell(ticksToDwell: number) {
        return this.buildOther(ACTIVITYTYPE.ACTIVITYTYPE_DWELL, {
            ticksToDwell
        } as DwellConfig)
    }

    moveArcWithCentre(
        target: Vector3,
        centre: Vector3,
        arcDirection: ARCDIRECTION,
        positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
        moveParams: MoveParametersConfig = {}
    ) {
        // at the moment target and centre must share position reference (relative or absolute)
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            {
                arc: {
                    destination: {
                        position: target,
                        positionReference
                    },
                    arcDirection,
                    arcType: ARCTYPE.ARCTYPE_CENTRE,
                    centre: {
                        position: centre,
                        positionReference
                    }
                }
            } as MoveArcStream,
            moveParams
        )
    }

    moveArcWithRadius(
        target: Vector3,
        radius: number,
        arcDirection: ARCDIRECTION,
        positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
        moveParams: MoveParametersConfig = {}
    ) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC,
            {
                arc: {
                    destination: {
                        position: target,
                        positionReference
                    },
                    arcDirection,
                    arcType: ARCTYPE.ARCTYPE_RADIUS,
                    radius: { value: radius }
                }
            } as MoveArcStream,
            moveParams
        )
    }

    moveJoints(
        jointPositionArray: number[],
        positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
        moveParams: MoveParametersConfig = {}
    ) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS,
            {
                jointPositionArray,
                positionReference
            },
            moveParams
        )
    }

    moveJointsAtVelocity(jointVelocityArray: number[], moveParams: MoveParametersConfig = {}) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY,
            {
                jointVelocityArray
            },
            moveParams
        )
    }

    moveLine(pos: Vector3, relative = false, moveParams: MoveParametersConfig = {}) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
            {
                line: {
                    positionReference: relative
                        ? POSITIONREFERENCE.RELATIVE
                        : POSITIONREFERENCE.ABSOLUTE,
                    position: pos
                }
            } as MoveLineStream,
            moveParams
        )
    }

    moveLineAtVelocity(line: CartesianVector, moveParams: MoveParametersConfig = {}) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVELINEATVELOCITY,
            {
                line
            },
            moveParams
        )
    }

    moveToPosition(pos: Vector3, moveParams: MoveParametersConfig = {}, positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE) {
        const cartesianPosition: CartesianPositionsConfig = {
            // TODO: can we come up with another name for position to avoid duplication in hierarchy
            position: {
                position: pos,
                positionReference
            }
        }

        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION,
            {
                cartesianPosition
            },
            moveParams
        )
    }

    setDout(index: number, value: boolean) {
        return this.buildOther(ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT, {
            doutToSet: index,
            valueToSet: value
        } as SetDoutCommand)
    }

    setAout(index: number, value: number) {
        return this.buildOther(ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT, {
            aoutToSet: index,
            valueToSet: value
        } as SetAoutCommand)
    }

    setIout(index: number, value: number) {
        return this.buildOther(ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT, {
            ioutToSet: index,
            valueToSet: value
        } as SetIoutCommand)
    }

    endProgram() {
        return this.buildOther(ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM)
    }
}