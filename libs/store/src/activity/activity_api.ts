import { ACTIVITYSTATE, MoveParametersConfig, TRIGGERTYPE } from "../gbc"
import {
    ActivityController,
    AoutBuilder,
    CancelActivityBuilder,
    DoutBuilder,
    DwellActivityBuilder,
    EndProgramBuilder,
    IoutBuilder,
    MoveArcBuilder,
    MoveJointsAtVelocityBuilder,
    MoveJointsBuilder,
    MoveLineAtVelocityBuilder,
    MoveLineBuilder,
    MoveToPositionBuilder,
    ToolChangeBuilder,
    WaitOnAnalogInputBuilder,
    WaitOnDigitalInputBuilder,
    WaitOnIntegerInputBuilder
} from "./builders"

// some functions can take null as a parameter to indicate that current value should be used (eg. xyz position on move)
function nullify(v?: number) {
    return Number.isInteger(v) ? v : null
}

/**
 * The GBR solo activity API (typically accessed using {@link useSoloActivity}) provides a convenient
 * way to send individual activities to GBC. The solo activity API is instantiated against a kinematics
 * configuration and has exclusive access to the motion of that KC. Attempting to execute a solo activity
 * while jogging or streaming (for example, GCode) will result in an error.
 *
 * Each method of the API returns a builder class that provides a fluent API with which you can further specify an activity.
 * After configuring the activity, call the `promise` method. This returns a promise which will be resolved when the activity completes,
 * allowing you to sequence multiple activities together.
 *
 * Each activity runs to completion unless cancelled or another activity is executed. If an activity
 * is running and another activity is issued, the first activity is cancelled and allowed to finish
 * gracefully before the new activity is started.
 *
 * Note that motion using the solo activity API is not blended (that is, absolute stop mode will be used).
 */
export interface SoloActivityApi {
    /** Cancel any currently executing activity */
    cancel(): CancelActivityBuilder

    /** Dwell for a number of cycles */
    dwell(ticksToDwell: number): DwellActivityBuilder

    /** Move in an arc.
     *
     * @param x Target x position
     * @param y Target y position
     * @param z Target z position
     * @returns A builder with which you can specify further characteristics of the move
     */
    moveArc(x?: number, y?: number, z?: number): MoveArcBuilder

    /** Move joints to specified positions. All joints in the kinematic configuration should be specified, or they will default to zero.
     *
     * @param jointPositionArray Array of joint positions
     */
    moveJoints(jointPositionArray: number[]): MoveJointsBuilder

    /** Move joints at the specified velocities. All joints in the kinematic configuration should be specified, or they will default to zero (no motion).
     *
     * Note that this activity does not terminate and will run forever unless cancelled (using `cancel` or by executing another activity).
     *
     * @param jointVelocityArray Array of joint velocities
     */
    moveJointsAtVelocity(jointVelocityArray: number[]): MoveJointsAtVelocityBuilder

    /** Move along a linear path to the target position.
     *
     * Note that if an axis is not specified (or `undefined`), the current position at the start of the move will be used. For example,
     * you can move to a new X position while keeping Y and Z constant by only specifying the new X position.
     *
     * @param x Target x position
     * @param y Target y position
     * @param z Target z position
     */
    moveLine(x?: number, y?: number, z?: number): MoveLineBuilder

    /** Move in a straight line along the given vector. The velocity of the motion can be controlled using `moveParams`.
     *
     * Note that this activity does not terminate and will run forever unless cancelled (using `cancel` or by executing another activity).
     *
     * @param x Vector x component
     * @param y Vector y component
     * @param z Vector z component
     */
    moveLineAtVelocity(x: number, y: number, z: number): MoveLineAtVelocityBuilder

    /** Move to the target position in joint space.
     *
     * Note that joints are run such that they all start and finish motion at the same time, but the path is not guaranteed to be linear.
     *
     * @param x Target x position
     * @param y Target y position
     * @param z Target z position
     */
    moveToPosition(x?: number, y?: number, z?: number): MoveToPositionBuilder

    /**
     * Set a digital output. Completes in a single cycle.
     *
     * @param index The digital output to set
     * @param value The value to set
     */
    setDout(index: number, value: boolean): DoutBuilder

    /**
     * Set an analog output. Completes in a single cycle.
     *
     * @param index The analog output to set
     * @param value The value to set
     */
    setAout(index: number, value: number): AoutBuilder

    /**
     * Set an integer output. Completes in a single cycle.
     *
     * @param index The integer output to set
     * @param value The value to set
     */
    setIout(index: number, value: number): IoutBuilder

    changeTool(kc: number, toolIndex: number): ToolChangeBuilder

    /**
     * @ignore Has no effect for solo activities
     */
    endProgram(): EndProgramBuilder
}

export abstract class ActivityApiBase implements SoloActivityApi, ActivityController {
    public readonly kinematicsConfigurationIndex: number

    protected constructor(kinematicsConfigurationIndex: number) {
        this.kinematicsConfigurationIndex = kinematicsConfigurationIndex
    }

    abstract get nextTag(): number

    abstract execute(command)

    cancel() {
        return new CancelActivityBuilder(this)
        // return this.buildMotion(ACTIVITYTYPE.ACTIVITYTYPE_NONE, {}, {})
    }

    dwell(ticksToDwell: number) {
        return new DwellActivityBuilder(this).ticksToDwell(ticksToDwell)
    }

    waitOnDigitalInput(index: number, type: TRIGGERTYPE) {
        return new WaitOnDigitalInputBuilder(this).index(index).triggerType(type)
    }

    waitOnIntegerInput(index: number) {
        return new WaitOnIntegerInputBuilder(this).index(index)
    }

    waitOnAnalogInput(index: number) {
        return new WaitOnAnalogInputBuilder(this).index(index)
    }

    moveArc(x?: number, y?: number, z?: number) {
        return new MoveArcBuilder(this).translation(nullify(x), nullify(y), nullify(z))
    }

    moveJoints(jointPositionArray: number[]) {
        return new MoveJointsBuilder(this).joints(jointPositionArray)
    }

    moveJointsAtVelocity(jointVelocityArray: number[], moveParams: MoveParametersConfig = {}) {
        return new MoveJointsAtVelocityBuilder(this).velocities(jointVelocityArray)
    }

    moveLine(x?: number, y?: number, z?: number) {
        return new MoveLineBuilder(this).translation(nullify(x), nullify(y), nullify(z))
    }

    moveLineAtVelocity(x: number, y: number, z: number) {
        return new MoveLineAtVelocityBuilder(this).vector(x, y, z)
    }

    moveToPosition(x?: number, y?: number, z?: number) {
        return new MoveToPositionBuilder(this).translation(nullify(x), nullify(y), nullify(z))
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

    changeTool(kc: number, toolIndex: number): ToolChangeBuilder {
        return new ToolChangeBuilder(this).kinematicsConfigurationIndex(kc).toolIndex(toolIndex)
    }

    endProgram() {
        return new EndProgramBuilder(this)
    }
}

export class ActivityApiImpl
    extends ActivityApiBase
    implements SoloActivityApi, ActivityController
{
    private readonly index: number
    private readonly _send: (msg: string) => void
    private currentTag = 0
    private promiseFifo: { tag: number; resolve; reject }[] = []

    constructor(index: number, send: (msg: string) => void) {
        super(index)
        this.index = index
        this._send = send
    }

    get nextTag(): number {
        return this.currentTag++
    }

    execute(command) {
        const soloActivity = JSON.stringify({
            command: {
                soloActivity: {
                    [this.index]: {
                        command
                    }
                }
            }
        })

        return new Promise((resolve, reject) => {
            this.promiseFifo.push({ tag: command.tag, resolve, reject })
            this._send(soloActivity)
        })
    }

    update(tag: number, state: ACTIVITYSTATE) {
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
        } else {
            // console.log("TAG RUNNING BUT NOT COMPLETED", tag)
        }
    }
}
