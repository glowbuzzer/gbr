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
    SetIoutCommand,
    Vector3
} from "../gbc"

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

export type SoloActivityApiResult = {
    promise: () => Promise<void>
    tag: number
    command: any
}

/**
 * The GBR solo activity API (typically accessed using {@link useSoloActivity}) provides a convenient
 * way to send individual activities to GBC. The solo activity API is instantiated against a kinematics
 * configuration and has exclusive access to the motion of that KC. Attempting to execute a solo activity
 * while jogging or streaming (for example, GCode) will result in an error.
 *
 * Each activity runs to completion unless cancelled or another activity is issued. If an activity
 * is running and another activity is issued, the first activity is cancelled and allowed to finish
 * gracefully before the new activity is started.
 *
 * The result of each method on the API is a {@link SoloActivityApiResult}. This optionally provides
 * a promise that is resolved when the activity completes or is cancelled. This allows you to sequence
 * multiple activities together.
 *
 * Note that motion using the solo activity API is not blended (that is, absolute stop mode will be used).
 */
export interface SoloActivityApi {
    /** Cancel any currently executing activity */
    cancel(): SoloActivityApiResult

    /** Dwell for a number of cycles */
    dwell(ticksToDwell: number): SoloActivityApiResult

    /** Move in an arc specifying a target position and arc center, and arc direction
     *
     * @param centre Centre of the arc
     * @param target Target position
     * @param arcDirection Arc direction, clockwise or counter-clockwise
     * @param positionReference Whether the target position and centre are relative to the current cartesian position or absolute (default: absolute)
     * @param moveParams Move parameters, if required
     */
    moveArcWithCentre(
        target: Vector3,
        centre: Vector3,
        arcDirection: ARCDIRECTION,
        positionReference?: POSITIONREFERENCE,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move in an arc specifying a target position and radius, and arc direction
     *
     * @param radius Radius of the arc
     * @param target Target position
     * @param arcDirection Arc direction, clockwise or counter-clockwise
     * @param positionReference Whether the target position is relative to the current cartesian position or absolute (default: absolute)
     * @param moveParams Move parameters, if required
     */
    moveArcWithRadius(
        target: Vector3,
        radius: number,
        arcDirection: ARCDIRECTION,
        positionReference?: POSITIONREFERENCE,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move joints to specified positions. All joints in the kinematic configuration should be specified, or they will default to zero.
     *
     * @param jointPositionArray Array of joint positions
     * @param positionReference Whether the joint positions are relative to the current joint positions or absolute (default: absolute)
     * @param moveParams Move parameters, if required
     */
    moveJoints(
        jointPositionArray: number[],
        positionReference?: POSITIONREFERENCE,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move joints at the specified velocities. All joints in the kinematic configuration should be specified, or they will default to zero (no motion).
     *
     * Note that this activity does not terminate and unless cancelled (using `cancel` or by executing another activity) the joints will run forever.
     *
     * @param jointVelocityArray Array of joint velocities
     * @param moveParams Move parameters, if required
     */
    moveJointsAtVelocity(
        jointVelocityArray: number[],
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move along a linear path to the target position.
     *
     * @param pos Target position
     * @param positionReference Whether the target position is relative to the current cartesian position or absolute (default: absolute)
     * @param moveParams Move parameters, if required
     */
    moveLine(
        pos: Vector3,
        positionReference?: POSITIONREFERENCE,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move in a straight line along the given vector. The velocity of the motion can be controlled using `moveParams`.
     *
     * Note that this activity does not terminate and unless cancelled (using `cancel` or by executing another activity) it will run forever.
     *
     * @param line Vector to move along. Includes a frame index
     * @param moveParams Move parameters, including desired velocity for the motion
     */
    moveLineAtVelocity(
        line: CartesianVector,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /** Move to the target position in joint space.
     *
     * Note that joints are run such that they all start and finish motion at the same time, but the path is not guaranteed to be linear.
     *
     * @param pos Target position
     * @param positionReference Whether the target position is relative to the current cartesian position or absolute (default: absolute)
     * @param moveParams Move parameters, if required
     */
    moveToPosition(
        pos: Vector3,
        positionReference?: POSITIONREFERENCE,
        moveParams?: MoveParametersConfig
    ): SoloActivityApiResult

    /**
     * Set a digital output. Completes in a single cycle.
     *
     * @param index The digital output to set
     * @param value The value to set
     */
    setDout(index: number, value: boolean): SoloActivityApiResult

    /**
     * Set an analog output. Completes in a single cycle.
     *
     * @param index The analog output to set
     * @param value The value to set
     */
    setAout(index: number, value: number): SoloActivityApiResult

    /**
     * Set an integer output. Completes in a single cycle.
     *
     * @param index The integer output to set
     * @param value The value to set
     */
    setIout(index: number, value: number): SoloActivityApiResult

    /**
     * @ignore Has no effect for solo activities
     */
    endProgram(): SoloActivityApiResult
}

export class ActivityApiImpl implements SoloActivityApi {
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

    moveLine(
        pos: Vector3,
        positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
        moveParams: MoveParametersConfig = {}
    ) {
        return this.buildMotion(
            ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
            {
                line: {
                    positionReference,
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

    moveToPosition(
        pos: Vector3,
        positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE,
        moveParams: MoveParametersConfig = {}
    ) {
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
