/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import {
    ActivityStreamItem,
    ACTIVITYTYPE,
    ARCDIRECTION,
    ArcsConfig,
    ARCTYPE,
    CartesianPosition,
    DwellActivityParams,
    MoveInstantStream,
    MoveJointsAtVelocityStream,
    MoveJointsInterpolatedStream,
    MoveJointsStream,
    MoveLineStream,
    MoveParametersConfig,
    MoveRotationAtVelocityStream,
    MoveToPositionStream,
    MoveVectorAtVelocityStream,
    PointsConfig,
    POSITIONREFERENCE,
    Quat,
    ROTATIONINTERPOLATION,
    SetAoutActivityParams,
    SetDoutActivityParams,
    SetModbusDoutActivityParams,
    SetModbusUioutActivityParams,
    SetIoutActivityParams,
    SpindleActivityParams,
    SPINDLEDIRECTION,
    SYNCTYPE,
    TriggerParams,
    Vector3,
    SetInitialPositionStream
} from "../../gbc"
import { Euler, EulerOrder, Quaternion } from "three"
import { c } from "tar"

export type ActivityPromiseResult = { tag: number; completed: boolean }

/** @ignore */
export interface ActivityController {
    get kinematicsConfigurationIndex(): number

    get nextTag(): number

    execute(command: ActivityStreamItem): Promise<ActivityPromiseResult>
}

function extract<T>(arg: T, keys: (keyof T)[]) {
    return Object.fromEntries(keys.map(key => [key, arg[key]]))
}

export abstract class ActivityBuilder {
    /** @ignore */
    tag: number
    /** @ignore */
    protected readonly controller: ActivityController
    /** @ignore */
    triggers: TriggerParams[] = []

    /** @ignore */
    constructor(controller: ActivityController) {
        this.controller = controller
        this.tag = controller.nextTag
        this.promise = this.promise.bind(this)
    }

    /** @ignore not currently supported */
    withTag(tag: number): this {
        this.tag = tag
        return this
    }

    /** Builds the activity and returns an object that can be serialised and sent to GBC */
    get command(): ActivityStreamItem {
        const command = {
            activityType: this.activityType,
            tag: this.tag
        }
        const params = this.build()
        if (params) {
            command[this.commandName] = params
        }

        return this.triggers.length ? { ...command, triggers: this.triggers } : command
    }

    /** Add a trigger to this activity */
    addTrigger(trigger: TriggerParams) {
        this.triggers.push(trigger)
        return this
    }

    /**
     * Executes the activity and returns a promise that will be resolved when the activity is complete.
     */
    promise(): Promise<ActivityPromiseResult> {
        return this.controller.execute(this.command)
    }

    /** The name of the command. */
    protected abstract get commandName(): string

    /** The type of activity. */
    protected abstract get activityType(): ACTIVITYTYPE

    /**
     * Build the activity parameters. Used internally and should not be used by applications.
     * @return An object containing any parameters that will be sent for the activity.
     */
    protected abstract build()
}

export class CancelActivityBuilder extends ActivityBuilder {
    protected commandName = ""
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_NONE

    /** @ignore */
    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class EndProgramBuilder extends ActivityBuilder {
    protected commandName = "endProgram"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM

    /** @ignore */
    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class PauseProgramBuilder extends ActivityBuilder {
    protected commandName = "pauseProgram"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_PAUSEPROGRAM

    /** @ignore */
    protected build() {
        // this activity type has no params (not even union member)
        return null
    }
}

export class ModbusDoutBuilder extends ActivityBuilder {
    protected commandName = "setModbusDout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSDOUT
    private doutToSet: number = 0
    private valueToSetArray: boolean[] = []

    dout(index: number): this {
        this.doutToSet = index
        return this
    }

    value(value: boolean[]): this {
        this.valueToSetArray = value
        return this
    }

    /** @ignore */
    protected build(): SetModbusDoutActivityParams {
        return {
            doutToSet: this.doutToSet,
            valueToSetArray: this.valueToSetArray
        }
    }
}

export class ModbusUioutBuilder extends ActivityBuilder {
    protected commandName = "setModbusUiout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSUIOUT
    private uioutToSet: number = 0
    private valueToSetArray: number[] = []

    uiout(index: number): this {
        this.uioutToSet = index
        return this
    }

    value(value: number[]): this {
        this.valueToSetArray = value
        return this
    }

    /** @ignore */
    protected build(): SetModbusUioutActivityParams {
        return {
            uioutToSet: this.uioutToSet,
            valueToSetArray: this.valueToSetArray
        }
    }
}

export class DwellActivityBuilder extends ActivityBuilder {
    protected commandName = "dwell"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_DWELL
    private _msToDwell: number

    /** Number of ticks to dwell. */
    msToDwell(msToDwell: number) {
        this._msToDwell = msToDwell
        return this
    }

    /** @ignore */
    protected build(): DwellActivityParams {
        return {
            msToDwell: this._msToDwell
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

    /** @ignore */
    protected build(): SpindleActivityParams {
        return {
            spindleIndex: this._spindleIndex,
            speed: this._speed,
            direction: this._direction,
            enable: this._enable
        }
    }
}

abstract class SimpleMoveBuilder extends ActivityBuilder {
    /** @ignore */
    private _params: MoveParametersConfig = {}

    /** The move parameters. */
    params(params: MoveParametersConfig) {
        // guard against null/undefined params
        if (params) {
            this._params = {
                ...this._params,
                ...params
            }
        }
        return this
    }

    /**
     * Specify how long his move should take to complete.
     * @param durationInMillis The duration of the move in milliseconds.
     */
    duration(durationInMillis: number) {
        this._params = {
            ...this._params,
            syncType: SYNCTYPE.SYNCTYPE_DURATION_MS,
            syncValue: durationInMillis
        }
        return this
    }

    /** @ignore */
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
    /** @ignore */
    protected _frameIndex = 0xffff // magic number to mean stay in local frame

    /** The frame index to use for the move */
    frameIndex(index: number) {
        this._frameIndex = index
        return this
    }
}

abstract class MoveBuilder extends MoveWithFrameBuilder {
    /** @ignore */
    protected _translation: Vector3
    /** @ignore */
    protected _rotation: Quat = { x: null, y: null, z: null, w: null }
    /** @ignore */
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
    rotationEuler(x: number, y: number, z: number, order: EulerOrder = "XYZ") {
        const q = new Quaternion().setFromEuler(new Euler(x, y, z, order))
        return this.rotation(q.x, q.y, q.z, q.w)
    }

    /**
     * Set the target position for the move from a cartesian position.
     * @param cartesianPosition The cartesian position to use for the move.
     */
    setFromCartesianPosition(cartesianPosition: CartesianPosition) {
        this._positionReference = cartesianPosition.positionReference
        // position passed in can contain THREE representations of the position,
        // and this causes issues serializing to redux store, for example, so we extract
        // only the properties we actually need
        this._translation = extract(cartesianPosition.translation, ["x", "y", "z"])
        this._rotation = extract(cartesianPosition.rotation, ["x", "y", "z", "w"])
        this._frameIndex = cartesianPosition.frameIndex
        return this
    }

    /**
     * Set the target position for the move from a position (typically one from the configuration).
     * @param point The point to use for the move.
     */
    setFromPoint(point: PointsConfig) {
        this._frameIndex = isNaN(point.frameIndex) ? this._frameIndex : point.frameIndex
        this._translation = point.translation
        this._rotation = point.rotation
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

    setFromPoint(point: PointsConfig) {
        super.setFromPoint(point)
        this._configuration = point.configuration
        return this
    }

    /** @ignore */
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

export class SetInitialPositionBuilder extends CartesianMoveBuilder {
    protected commandName = "setInitialPosition"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETINITIALPOSITION
    /** @ignore */
    private _configuration = 255 // magic for "null" / not specified

    /** The configuration (waist, elbow, wrist) for the target position. */
    configuration(c: number) {
        this._configuration = c
        return this
    }

    relative(_isRelative: boolean = true): this {
        throw new Error("Relative positions are not valid for setInitialPosition")
    }

    params(_params: MoveParametersConfig): this {
        throw new Error("Move params are not valid for setInitialPosition")
    }

    duration(_durationInMillis: number): this {
        throw new Error("Duration is not valid for setInitialPosition")
    }

    /** @ignore */
    protected build(): SetInitialPositionStream {
        return {
            kinematicsConfigurationIndex: this.controller.kinematicsConfigurationIndex,
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

    /** @ignore */
    protected build(): MoveLineStream {
        return {
            ...super.build(),
            line: this.cartesianPosition
        }
    }
}

export class MoveInstantBuilder extends CartesianMoveBuilder {
    protected commandName = "moveInstant"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEINSTANT

    /** @ignore */
    protected build(): MoveInstantStream {
        return {
            ...super.build(),
            position: this.cartesianPosition
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

    /** @ignore */
    protected build(): MoveJointsStream {
        return {
            ...super.build(),
            jointPositionArray: this.jointPositionArray,
            positionReference: this._positionReference
        }
    }
}

export class MoveJointsInterpolatedBuilder extends SimpleMoveBuilder {
    protected commandName = "moveJointsInterpolated"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSINTERPOLATED
    private _duration: number
    private jointPositionArray: number[]
    private jointVelocityArray: number[]

    duration(value: number) {
        this._duration = value
        return this
    }

    /** Target joint values. If null is passed for some values, these joints will not be moved. */
    positions(values: number[]) {
        this.jointPositionArray = values
        return this
    }

    velocities(values: number[]) {
        this.jointVelocityArray = values
        return this
    }

    /** @ignore */
    protected build(): MoveJointsInterpolatedStream {
        return {
            ...super.build(),
            duration: this._duration,
            jointPositionArray: this.jointPositionArray,
            jointVelocityArray: this.jointVelocityArray
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

    /** @ignore */
    protected build(): MoveJointsAtVelocityStream {
        return {
            ...super.build(),
            jointVelocityArray: this.jointVelocityArray
        }
    }
}

export class MoveVectorAtVelocityBuilder extends MoveWithFrameBuilder {
    protected commandName = "moveVectorAtVelocity"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY
    private _vector: Vector3

    /** Vector in which move will be made. Velocity is specified using `params` method. */
    vector(x: number, y: number, z: number) {
        this._vector = { x, y, z }
        return this
    }

    /** @ignore */
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

export class MoveRotationAtVelocityBuilder extends MoveWithFrameBuilder {
    protected commandName = "moveRotationAtVelocity"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEROTATIONATVELOCITY
    private _vector: Vector3

    /** Vector for the axis of rotation about which move will be made. Velocity is specified using `params` method, and represents a clockwise rotation about the axis, looking in the direction of the vector */
    axis(x: number, y: number, z: number) {
        this._vector = { x, y, z }
        return this
    }

    /** @ignore */
    protected build(): MoveRotationAtVelocityStream {
        return {
            ...super.build(),
            axis: {
                frameIndex: this._frameIndex,
                vector: this._vector
            }
        }
    }
}

export class MoveArcBuilder extends CartesianMoveBuilder {
    protected commandName = "moveArc"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC
    /** @ignore */
    private _direction: ARCDIRECTION = ARCDIRECTION.ARCDIRECTION_CW
    /** @ignore */
    private _centre: Vector3
    /** @ignore */
    private _centrePositionReference: POSITIONREFERENCE
    /** @ignore */
    private _radius: number
    /** @ignore */
    private _plane: Quat
    /** @ignore */
    private _rotationInterpolation: ROTATIONINTERPOLATION =
        ROTATIONINTERPOLATION.ROTATIONINTERPOLATION_SHORT_SLERP

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

    /** The plane of the arc, used for plane switching if arc should not be in the XY plane. */
    plane(x, y, z, w) {
        this._plane = { x, y, z, w }
        return this
    }

    /** The rotation interpolation mode. */
    rotationInterpolation(rotationInterpolation: ROTATIONINTERPOLATION) {
        this._rotationInterpolation = rotationInterpolation
        return this
    }

    /** @ignore */
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
        arc.rotationInterpolation = this._rotationInterpolation
        if (this._plane) {
            arc.plane = this._plane
        }

        return { ...super.build(), arc }
    }
}

abstract class SetOutputBuilder<T> extends ActivityBuilder {
    private _valueToSet: T

    /** The value to set. */
    value(value: T) {
        this._valueToSet = value
        return this
    }

    /** @ignore */
    protected build(): { valueToSet?: T } {
        return {
            valueToSet: this._valueToSet
        }
    }
}

export abstract class GenericDoutBuilder extends SetOutputBuilder<boolean> {
    private _doutToSet: number

    /** The index of the digital output to set. */
    dout(index: number) {
        this._doutToSet = index
        return this
    }

    /** @ignore */
    protected build(): SetDoutActivityParams {
        return {
            doutToSet: this._doutToSet,
            ...super.build()
        }
    }
}

export class DoutBuilder extends GenericDoutBuilder {
    protected commandName = "setDout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT
}

export class ExternalDoutBuilder extends GenericDoutBuilder {
    protected commandName = "setExternalDout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT
}

export class AoutBuilder extends SetOutputBuilder<number> {
    protected commandName = "setAout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT
    private _aoutToSet: number

    /** The index of the analog output to set. */
    aout(index: number) {
        this._aoutToSet = index
        return this
    }

    /** @ignore */
    protected build(): SetAoutActivityParams {
        return {
            aoutToSet: this._aoutToSet,
            ...super.build()
        }
    }
}

export abstract class GenericIoutBuilder extends SetOutputBuilder<number> {
    private _ioutToSet: number

    /** The index of the integer output to set. */
    iout(index: number) {
        this._ioutToSet = index
        return this
    }

    /** @ignore */
    protected build(): SetIoutActivityParams {
        return {
            ioutToSet: this._ioutToSet,
            ...super.build()
        }
    }
}

export class IoutBuilder extends GenericIoutBuilder {
    protected commandName = "setIout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT
}

export class UioutBuilder extends GenericIoutBuilder {
    protected commandName = "setUiout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT
}

export class ExternalIoutBuilder extends GenericIoutBuilder {
    protected commandName = "setExternalIout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT
}

export class ExternalUioutBuilder extends GenericIoutBuilder {
    protected commandName = "setExternalUiout"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT
}

export class ToolOffsetBuilder extends ActivityBuilder {
    protected commandName = "setToolOffset"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET
    private _toolIndex: number

    toolIndex(value: number) {
        this._toolIndex = value
        return this
    }

    /** @ignore */
    protected build() {
        return {
            toolIndex: this._toolIndex
        }
    }
}

export class SetPayloadBuilder extends ActivityBuilder {
    protected commandName = "setPayload"
    protected activityType = ACTIVITYTYPE.ACTIVITYTYPE_SET_PAYLOAD
    private _mass: number

    mass(value: number) {
        this._mass = value
        return this
    }

    /** @ignore */
    protected build() {
        return {
            mass: this._mass
        }
    }
}

export class ActivityStreamItemBuilder extends ActivityBuilder {
    constructor(
        controller: ActivityController,
        private readonly activity: ActivityStreamItem
    ) {
        super(controller)
    }

    protected get activityType(): ACTIVITYTYPE {
        return this.activity.activityType
    }

    get command(): ActivityStreamItem {
        return { ...this.activity, tag: this.tag }
    }

    protected build() {
        throw new Error("Unsupported operation")
    }

    protected get commandName(): string {
        // already exists in the given activity stream item
        return null
    }
}
