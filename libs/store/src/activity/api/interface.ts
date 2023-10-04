/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    AoutBuilder,
    DoutBuilder,
    DwellActivityBuilder,
    IoutBuilder,
    MoveArcBuilder,
    MoveInstantBuilder,
    MoveJointsAtVelocityBuilder,
    MoveJointsBuilder,
    MoveLineBuilder,
    MoveRotationAtVelocityBuilder,
    MoveToPositionBuilder,
    MoveVectorAtVelocityBuilder,
    SpindleActivityBuilder,
    ToolOffsetBuilder
} from "./builders"
import { SPINDLEDIRECTION } from "../../gbc"

export interface ActivityApi {
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

    /**
     * Sets the current tool offset. This is used to calculate the position of the tool tip and is typically
     * invoked after a tool change.
     *
     * @param toolIndex
     */
    setToolOffset(toolIndex: number): ToolOffsetBuilder

    /**
     * Control the spindle.
     *
     * @param spindleIndex
     * @param enable
     * @param speed
     * @param direction
     */
    spindle(
        spindleIndex,
        enable?: boolean,
        speed?: number,
        direction?: SPINDLEDIRECTION
    ): SpindleActivityBuilder

    /**
     * Run activities in sequence. The activities provided will be executed in order.
     *
     * If any activity is cancelled, the rest of the sequence will be cancelled.
     *
     * @param builders The array of builders to execute
     */
    // sequence(...builders: ActivityBuilder[]): Promise<void>
}
