/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    ActivityStreamItemBuilder,
    AoutBuilder,
    DwellActivityBuilder,
    ModbusDoutBuilder,
    ModbusUioutBuilder,
    GenericDoutBuilder,
    GenericIoutBuilder,
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
    SetInitialPositionBuilder,
    PauseProgramBuilder
} from "./builders"
import { ActivityStreamItem, SPINDLEDIRECTION } from "../../gbc"

export interface ActivityApi {
    /** Dwell for a number of cycles */
    dwell(msToDwell: number): DwellActivityBuilder

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

    /** Move joints to specified positions and velocities interpolated. All joints in the kinematic configuration should be specified, or they will default to zero.
     *
     * @param duration Duration of the move in seconds
     * @param jointPositionArray Array of joint positions
     * @param jointVelocityArray Array of joint velocities
     */
    moveJointsInterpolated(
        duration: number,
        jointPositionArray: number[],
        jointVelocityArray: number[]
    ): MoveJointsInterpolatedBuilder

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

    /** Move to a position instantaneously in cartesian space.
     *
     * Note that if you use this activity it is your responsibility to generate the points in such a way that the
     * velocity, acceleration and jerk limits of the machine are not breached, and you must continue to send points
     * until the machine is at a stop, otherwise an error will occur.
     *
     * @param x New x position
     * @param y New y position
     * @param z New z position
     */
    moveInstant(x?: number, y?: number, z?: number): MoveInstantBuilder

    /** Move in a straight line along the given vector. The velocity of the motion can be controlled using `moveParams`.
     *
     * Note that this activity does not terminate and will run forever unless cancelled (using `cancel` or by executing another activity).
     *
     * @param x Vector x component
     * @param y Vector y component
     * @param z Vector z component
     */
    moveVectorAtVelocity(x: number, y: number, z: number): MoveVectorAtVelocityBuilder

    /** Rotate around an axis at a given velocity. The velocity of the motion can be controlled using `moveParams`. The position
     * does not change.
     *
     * Note that this activity does not terminate and will run forever unless cancelled (using `cancel` or by executing another activity).
     *
     * @param x Axis of rotation x component
     * @param y Axis of rotation y component
     * @param z Axis of rotation z component
     */
    moveRotationAtVelocity(x: number, y: number, z: number): MoveRotationAtVelocityBuilder

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
     * Set the initial position of the machine. Only applicable for machines with a kinematic configuration that can have a fluid initial position, such as an AGV.
     *
     * @param x Initial x position
     * @param y Initial y position
     * @param z Initial z position
     */
    setInitialPosition(x?: number, y?: number, z?: number): SetInitialPositionBuilder

    /**
     * Set a digital output. Completes in a single cycle.
     *
     * @param index The digital output to set
     * @param value The value to set
     */
    setDout(index: number, value: boolean): GenericDoutBuilder

    /**
     * Set an external digital output. Completes in a single cycle.
     *
     * @param index The digital output to set
     * @param value The value to set
     */
    setExternalDout(index: number, value: boolean): GenericDoutBuilder

    /**
     * Set a modbus digital output. Completes in multiple cycles.
     *
     * @param index The digital output to set
     * @param values The array of values to set
     */
    setModbusDout(index: number, values: boolean[]): ModbusDoutBuilder

    /**
     * Set a modbus unsigned integer output. Completes in multiple cycles.
     * @param index The index of the output
     * @param values The array of values to set
     */
    setModbusUiout(index: number, values: number[]): ModbusUioutBuilder

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
    setIout(index: number, value: number): GenericIoutBuilder

    /**
     * Set an unsigned integer output. Completes in a single cycle.
     *
     * @param index The integer output to set
     * @param value The value to set
     */
    setUiout(index: number, value: number): GenericIoutBuilder

    /**
     * Set an external integer output. Completes in a single cycle.
     *
     * @param index The integer output to set
     * @param value The value to set
     */
    setExternalIout(index: number, value: number): GenericIoutBuilder

    /**
     * Set an external unsigned integer output. Completes in a single cycle.
     *
     * @param index The integer output to set
     * @param value The value to set
     */
    setExternalUiout(index: number, value: number): GenericIoutBuilder

    /**
     * Sets the current tool offset. This is used to calculate the position of the tool tip and is typically
     * invoked after a tool change.
     *
     * @param toolIndex
     */
    setToolOffset(toolIndex: number): ToolOffsetBuilder

    /**
     * Sets the current payload.
     *
     * @param mass The mass of the payload.
     */
    setPayload(mass: number): SetPayloadBuilder

    /**
     * Control the spindle.
     *
     * @param spindleIndex
     * @param enable
     * @param speed
     * @param direction
     */
    spindle(
        spindleIndex: number,
        enable?: boolean,
        speed?: number,
        direction?: SPINDLEDIRECTION
    ): SpindleActivityBuilder

    /**
     * This will pause the stream until the stream is resumed by sending a stream resume command.
     * This is useful, for example, for tool changes where the operator has to perform
     * a task before resuming execution.
     */
    pauseProgram(): PauseProgramBuilder

    /**
     * Create an activity from an existing activity stream item. A builder is created that can be executed as part of a stream.
     *
     * @param activity The activity that is used to initialise the builder
     */
    from(activity: ActivityStreamItem): ActivityStreamItemBuilder
}
