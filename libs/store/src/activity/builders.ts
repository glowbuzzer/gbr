import {
    ACTIVITYTYPE,
    ARCDIRECTION,
    ArcsConfig,
    ARCTYPE,
    CartesianPosition,
    DwellConfig,
    GTLT,
    MoveJointsAtVelocityStream,
    MoveJointsStream,
    MoveVectorAtVelocityStream,
    MoveLineStream,
    MoveParametersConfig,
    MoveToPositionStream,
    POSITIONREFERENCE,
    Quat,
    SetAoutCommand,
    SetDoutCommand,
    SetIoutCommand,
    SPINDLEDIRECTION,
    SpindleStream,
    TRIGGERTYPE,
    Vector3,
    WaitOnAnalogInputConfig,
    WaitOnDigitalInputConfig,
    WaitOnIntegerInputConfig
} from "../gbc"
import { Euler, Quaternion } from "three"

export interface ActivityController {
    get kinematicsConfigurationIndex(): number

    get nextTag(): number

    execute(command)
}

export abstract class ActivityBuilder {
    /** @ignore */
    tag: number
    protected readonly controller: ActivityController

    /** @ignore */
    constructor(controller: ActivityController) {
        this.controller = controller
        this.tag = controller.nextTag
    }

    /** @ignore */
    get command() {
        const command = {
            activityType: this.activityType,
            tag: this.tag
        }
        const params = this.build()
        if (params) {
            command[this.commandName] = params
        }

        return command
    }

    /**
     * Executes the activity and returns a promise that will be resolved when the activity is complete.
     */
    get promise(): () => Promise<void> {
        return () => {
            return this.controller.execute(this.command)
        }
    }

    protected abstract get commandName(): string

    protected abstract get activityType(): ACTIVITYTYPE

    protected abstract build()
}

export class CancelActivityBuilder extends ActivityBuilder {
    protected commandName = ""
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_NONE

    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class EndProgramBuilder extends ActivityBuilder {
    protected commandName = "endProgram"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM

    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class PauseProgramBuilder extends ActivityBuilder {
    protected commandName = "pauseProgram"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_PAUSEPROGRAM

    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class DwellActivityBuilder extends ActivityBuilder {
    protected commandName = "dwell"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_DWELL
    private _ticksToDwell: number

    /** Number of ticks to dwell. */
    ticksToDwell(ticksToDwell: number) {
        this._ticksToDwell = ticksToDwell
        return this
    }

    protected build(): DwellConfig {
        return {
            ticksToDwell: this._ticksToDwell
        }
    }
}

export class SpindleActivityBuilder extends ActivityBuilder {
    protected commandName = "spindle"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SPINDLE
    private _spindleIndex: number
    private _speed: number
    private _direction: SPINDLEDIRECTION
    private _enable: boolean

    spindleIndex(spindleIndex: number) {
        this._spindleIndex = spindleIndex
        return this
    }

    speed(speed: number) {
        this._speed = speed
        return this
    }

    direction(direction: SPINDLEDIRECTION) {
        this._direction = direction
        return this
    }

    enable(enable: boolean) {
        this._enable = enable
        return this
    }

    protected build(): SpindleStream {
        return {
            spindleIndex: this._spindleIndex,
            speed: this._speed,
            direction: this._direction,
            enable: this._enable
        }
    }
}

abstract class WaitOnBuilder extends ActivityBuilder {
    protected _index: number

    index(index: number) {
        this._index = index
        return this
    }
}

export class WaitOnDigitalInputBuilder extends WaitOnBuilder {
    protected commandName = "waitOnDigitalInput"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_WAITON_DIN
    private _triggerType: TRIGGERTYPE

    triggerType(type: TRIGGERTYPE) {
        this._triggerType = type
        return this
    }

    protected build(): WaitOnDigitalInputConfig {
        return {
            index: this._index,
            triggerType: this._triggerType
        }
    }
}

abstract class WaitOnNumericBuilder extends WaitOnBuilder {
    private _value: number
    private _condition = GTLT.GREATERTHAN

    value(value: number) {
        this._value = value
        return this
    }

    condition(c: GTLT) {
        this._condition = c
        return this
    }

    protected build(): { value?: number; condition?: GTLT } {
        return {
            value: this._value,
            condition: this._condition
        }
    }
}

export class WaitOnIntegerInputBuilder extends WaitOnNumericBuilder {
    protected commandName = "waitOnIntegerInput"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_WAITON_IIN

    protected build(): WaitOnIntegerInputConfig {
        return {
            index: this._index,
            ...super.build()
        }
    }
}

export class WaitOnAnalogInputBuilder extends WaitOnNumericBuilder {
    protected commandName = "waitOnAnalogInput"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_WAITON_AIN

    protected build(): WaitOnAnalogInputConfig {
        return {
            index: this._index,
            ...super.build()
        }
    }
}

abstract class SimpleMoveBuilder extends ActivityBuilder {
    private _params: MoveParametersConfig = {}

    /** The move parameters. */
    params(params: MoveParametersConfig) {
        this._params = {
            ...this._params,
            ...params
        }
        return this
    }

    protected build(): {
        moveParams?: MoveParametersConfig
        kinematicsConfigurationIndex?: number
    } {
        return {
            moveParams: this._params,
            kinematicsConfigurationIndex: this.controller.kinematicsConfigurationIndex
        }
    }
}

abstract class MoveWithFrameBuilder extends SimpleMoveBuilder {
    protected _frameIndex = 0xffff // magic number to mean stay in local frame

    /** The frame index to use for the move */
    frameIndex(index: number) {
        this._frameIndex = index
        return this
    }
}

abstract class MoveBuilder extends MoveWithFrameBuilder {
    protected _translation: Vector3
    protected _rotation: Quat = { x: null, y: null, z: null, w: null }
    protected _positionReference: POSITIONREFERENCE

    /** Specify if the move is relative (default is absolute move). */
    relative(isRelative = true) {
        this._positionReference = isRelative
            ? POSITIONREFERENCE.RELATIVE
            : POSITIONREFERENCE.ABSOLUTE
        return this
    }

    /** The target position for the move in cartesian space. */
    translation(x: number | null, y: number | null, z: number | null) {
        this._translation = { x, y, z }
        return this
    }

    /** The target rotation of the tool centre point as a quaternion. */
    rotation(x: number, y: number, z: number, w: number) {
        this._rotation = { x, y, z, w }
        return this
    }

    /** The target rotation of the tool centre point in Euler angles.
     *
     * @param x X rotation in radians
     * @param y Y rotation in radians
     * @param z Z rotation in radians
     * @param order The order in which X, Y and Z angles will be applied (default: "XYZ")
     */
    rotationEuler(x: number, y: number, z: number, order = "XYZ") {
        const q = new Quaternion().setFromEuler(new Euler(x, y, z, order))
        return this.rotation(q.x, q.y, q.z, q.w)
    }

    setFromCartesianPosition(cartesianPosition: CartesianPosition) {
        this._positionReference = cartesianPosition.positionReference
        this._translation = cartesianPosition.translation
        this._rotation = cartesianPosition.rotation
        this._frameIndex = cartesianPosition.frameIndex
        return this
    }
}

abstract class CartesianMoveBuilder extends MoveBuilder {
    protected get cartesianPosition(): CartesianPosition {
        return {
            translation: this._translation,
            rotation: this._rotation,
            positionReference: this._positionReference,
            frameIndex: this._frameIndex
        }
    }
}

export class MoveToPositionBuilder extends CartesianMoveBuilder {
    protected commandName = "moveToPosition"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION
    private _configuration = 255 // magic for "null" / not specified

    /** The configuration (waist, elbow, wrist) for the target position. */
    configuration(c: number) {
        this._configuration = c
        return this
    }

    protected build(): MoveToPositionStream {
        return {
            ...super.build(),
            cartesianPosition: {
                position: this.cartesianPosition,
                configuration: this._configuration
            }
        }
    }
}

export class MoveLineBuilder extends CartesianMoveBuilder {
    protected commandName = "moveLine"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE

    protected build(): MoveLineStream {
        return {
            ...super.build(),
            line: this.cartesianPosition
        }
    }
}

export class MoveJointsBuilder extends SimpleMoveBuilder {
    protected commandName = "moveJoints"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS
    protected _positionReference: POSITIONREFERENCE
    private jointPositionArray: number[]

    /** Specify if the move is relative (default is absolute move). */
    relative(isRelative = true) {
        this._positionReference = isRelative
            ? POSITIONREFERENCE.RELATIVE
            : POSITIONREFERENCE.ABSOLUTE
        return this
    }

    /** Target joint values. If null is passed for some values, these joints will not be moved. */
    joints(values: number[]) {
        this.jointPositionArray = values
        return this
    }

    protected build(): MoveJointsStream {
        return {
            ...super.build(),
            jointPositionArray: this.jointPositionArray,
            positionReference: this._positionReference
        }
    }
}

export class MoveJointsAtVelocityBuilder extends SimpleMoveBuilder {
    protected commandName = "moveJointsAtVelocity"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY
    private jointVelocityArray: number[]

    /** Individual joint velocities. */
    velocities(values: number[]) {
        this.jointVelocityArray = values
        return this
    }

    protected build(): MoveJointsAtVelocityStream {
        return {
            ...super.build(),
            jointVelocityArray: this.jointVelocityArray
        }
    }
}

export class MoveLineAtVelocityBuilder extends MoveWithFrameBuilder {
    protected commandName = "moveLineAtVelocity"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY
    private _vector: Vector3

    /** Vector in which move will be made. Velocity is specified using `params` method. */
    vector(x: number, y: number, z: number) {
        this._vector = { x, y, z }
        return this
    }

    protected build(): MoveVectorAtVelocityStream {
        return {
            ...super.build(),
            vector: {
                frameIndex: this._frameIndex,
                vector: this._vector
            }
        }
    }
}

export class MoveArcBuilder extends CartesianMoveBuilder {
    protected commandName = "moveArc"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC
    private _direction: ARCDIRECTION = ARCDIRECTION.ARCDIRECTION_CW
    private _centre: Vector3
    private _centrePositionReference: POSITIONREFERENCE
    private _radius: number

    /** The direction of the arc (clockwise or counter-clockwise). */
    direction(direction: ARCDIRECTION) {
        this._direction = direction
        return this
    }

    /** The centre of the arc when using arc centre mode. The centre must be equidistant from the start position and target position. */
    centre(x, y, z, positionReference: POSITIONREFERENCE = POSITIONREFERENCE.ABSOLUTE) {
        this._centre = { x, y, z }
        this._centrePositionReference = positionReference
        return this
    }

    /** The radius of the arc when using arc radius mode. */
    radius(radius: number) {
        this._radius = radius
        return this
    }

    protected build() {
        const arc: ArcsConfig = this._centre
            ? {
                  arcType: ARCTYPE.ARCTYPE_CENTRE,
                  centre: {
                      positionReference: this._centrePositionReference,
                      translation: this._centre
                  }
              }
            : {
                  arcType: ARCTYPE.ARCTYPE_RADIUS,
                  radius: {
                      value: this._radius
                  }
              }
        arc.destination = this.cartesianPosition
        arc.arcDirection = this._direction

        return { ...super.build(), arc }
    }
}

abstract class SetOutputBuilder extends ActivityBuilder {
    private _valueToSet

    /** The value to set. */
    value(value) {
        this._valueToSet = value
        return this
    }

    protected build(): { valueToSet? } {
        return {
            valueToSet: this._valueToSet
        }
    }
}

export class DoutBuilder extends SetOutputBuilder {
    protected commandName = "setDout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT
    private _doutToSet: number

    /** The index of the digital output to set. */
    dout(index: number) {
        this._doutToSet = index
        return this
    }

    protected build(): SetDoutCommand {
        return {
            doutToSet: this._doutToSet,
            ...super.build()
        }
    }
}

export class AoutBuilder extends SetOutputBuilder {
    protected commandName = "setAout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT
    private _aoutToSet: number

    /** The index of the analog output to set. */
    aout(index: number) {
        this._aoutToSet = index
        return this
    }

    protected build(): SetAoutCommand {
        return {
            aoutToSet: this._aoutToSet,
            ...super.build()
        }
    }
}

export class IoutBuilder extends SetOutputBuilder {
    protected commandName = "setIout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT
    private _ioutToSet: number

    /** The index of the integer output to set. */
    iout(index: number) {
        this._ioutToSet = index
        return this
    }

    protected build(): SetIoutCommand {
        return {
            ioutToSet: this._ioutToSet,
            ...super.build()
        }
    }
}

export class ToolOffsetBuilder extends ActivityBuilder {
    protected commandName = "setToolOffset"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET
    private _toolIndex: number

    toolIndex(value: number) {
        this._toolIndex = value
        return this
    }

    protected build() {
        return {
            toolIndex: this._toolIndex
        }
    }
}
