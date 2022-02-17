import {
    ACTIVITYTYPE,
    ARCDIRECTION,
    ArcsConfig,
    ARCTYPE,
    CartesianPosition,
    DwellConfig,
    MoveJointsAtVelocityStream,
    MoveJointsStream,
    MoveLineAtVelocityStream,
    MoveLineStream,
    MoveParametersConfig,
    MoveToPositionStream,
    POSITIONREFERENCE,
    Quat,
    SetAoutCommand,
    SetDoutCommand,
    SetIoutCommand,
    Vector3
} from "@glowbuzzer/store"
import { Euler, Quaternion } from "three"

export interface ActivityController {
    nextTag: number

    execute(command)
}

abstract class ActivityBuilder {
    private controller: ActivityController
    tag: number

    constructor(controller: ActivityController) {
        this.controller = controller
        this.tag = controller.nextTag
    }

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

    get promise() {
        return () => {
            return this.controller.execute(this.command)
        }
    }

    protected abstract build()

    abstract get commandName(): string

    abstract get activityType(): ACTIVITYTYPE
}

export class CancelActivityBuilder extends ActivityBuilder {
    commandName = ""
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_NONE

    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class EndProgramBuilder extends ActivityBuilder {
    commandName = "endProgram"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM

    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class DwellActivityBuilder extends ActivityBuilder {
    private readonly ticksToDwell: number
    commandName = "dwell"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_DWELL

    constructor(controller: ActivityController, ticksToDwell: number) {
        super(controller)
        this.ticksToDwell = ticksToDwell
    }

    protected build(): DwellConfig {
        return {
            ticksToDwell: this.ticksToDwell
        }
    }
}

abstract class SimpleMoveBuilder extends ActivityBuilder {
    private _params: MoveParametersConfig = {}

    params(params: MoveParametersConfig) {
        this._params = {
            ...this._params,
            ...params
        }
        return this
    }

    protected build(): { moveParams?: MoveParametersConfig } {
        return {
            moveParams: this._params
        }
    }
}

abstract class MoveWithFrameBuilder extends SimpleMoveBuilder {
    protected _frameIndex = 0

    frameIndex(index: number) {
        this._frameIndex = index
        return this
    }
}

abstract class MoveBuilder extends MoveWithFrameBuilder {
    protected _translation: Vector3
    protected _rotation: Quat
    protected _positionReference: POSITIONREFERENCE

    relative(isRelative = true) {
        this._positionReference = isRelative
            ? POSITIONREFERENCE.RELATIVE
            : POSITIONREFERENCE.ABSOLUTE
        return this
    }

    translation(x: number | null, y: number | null, z: number | null) {
        this._translation = { x, y, z }
        return this
    }

    rotation(x: number, y: number, z: number, w: number) {
        this._rotation = { x, y, z, w }
        return this
    }

    rotationEuler(x: number, y: number, z: number, order = "XYZ") {
        const q = new Quaternion().setFromEuler(new Euler(x, y, z, order))
        return this.rotation(q.x, q.y, q.z, q.w)
    }
}

abstract class CartesianMoveBuilder extends MoveBuilder {
    get cartesianPosition(): CartesianPosition {
        return {
            translation: this._translation,
            rotation: this._rotation,
            positionReference: this._positionReference,
            frameIndex: this._frameIndex
        }
    }
}

export class MoveToPositionBuilder extends CartesianMoveBuilder {
    commandName = "moveToPosition"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION
    private _configuration

    protected build(): MoveToPositionStream {
        return {
            ...super.build(),
            cartesianPosition: {
                position: this.cartesianPosition,
                configuration: this._configuration
            }
        }
    }

    configuration(c: number) {
        this._configuration = c
        return this
    }
}

export class MoveLineBuilder extends CartesianMoveBuilder {
    commandName = "moveLine"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE

    protected build(): MoveLineStream {
        return {
            ...super.build(),
            line: this.cartesianPosition
        }
    }
}

export class MoveJointsBuilder extends SimpleMoveBuilder {
    commandName = "moveJoints"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS
    private jointPositionArray: number[]
    protected _positionReference: POSITIONREFERENCE

    relative(isRelative = true) {
        this._positionReference = isRelative
            ? POSITIONREFERENCE.RELATIVE
            : POSITIONREFERENCE.ABSOLUTE
        return this
    }

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
    commandName = "moveJointsAtVelocity"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY
    private jointVelocityArray: number[]

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
    commandName = "moveLineAtVelocity"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVELINEATVELOCITY
    private _vector: Vector3

    vector(x: number, y: number, z: number) {
        this._vector = { x, y, z }
        return this
    }

    protected build(): MoveLineAtVelocityStream {
        return {
            ...super.build(),
            line: {
                frameIndex: this._frameIndex,
                vector: this._vector
            }
        }
    }
}

export class MoveArcBuilder extends CartesianMoveBuilder {
    commandName = "moveArc"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC
    private _direction: ARCDIRECTION = ARCDIRECTION.ARCDIRECTION_CW
    private _centre: Vector3
    private _radius: number

    direction(direction: ARCDIRECTION) {
        this._direction = direction
        return this
    }

    centre(x, y, z) {
        this._centre = { x, y, z }
        return this
    }

    radius(radius: number) {
        this._radius = radius
        return this
    }

    protected build() {
        const arc: ArcsConfig = this._centre
            ? {
                  arcType: ARCTYPE.ARCTYPE_CENTRE,
                  centre: {
                      positionReference: this._positionReference,
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
    commandName = "setDout"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT
    private _doutToSet: number

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
    commandName = "setAout"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT
    private _aoutToSet: number

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
    commandName = "setIout"
    activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT
    private _ioutToSet: number

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
