/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    ActivityConfig,
    ActivityStatus,
    AinConfig,
    AinStatus,
    AoutCommand,
    AoutConfig,
    AoutStatus,
    CartesianPosition,
    DinConfig,
    DinStatus,
    DoutCommand,
    DoutConfig,
    DoutStatus,
    FieldbusConfig,
    FramesConfig,
    IinConfig,
    IinStatus,
    IoutCommand,
    IoutConfig,
    IoutStatus,
    JointCommand,
    JointConfig,
    JointStatus,
    KinematicsConfigurationConfig,
    KinematicsConfigurationStatus,
    MachineConfig,
    MachineStatus,
    MoveParametersConfig,
    SpindleConfig,
    STREAMSTATE,
    TaskConfig,
    TaskStatus,
    ToolConfig,
    Vector3
} from "./gbc"

// contains additional types that should be included in the generated typedoc, eg. config type and status type

/**
 * The configuration uploaded to GBC and which is retrieved by GBR on connection. Each key has a list of configuration objects for that part of the configuration.
 *
 * Each configuration object in the list can have an optional `name` property which will be displayed in the UI.
 *
 * ```js
 * const config:ConfigType={
 *     joint: [
 *         {name: "my joint", ...},
 *         {...},
 *         {...}
 *     ],
 *     frames: [
 *         {...}
 *         {...}
 *     ]
 * }
 * ```
 *
 * See the individual types for each configuration item for further details.
 */
export type GlowbuzzerConfig = {
    machine?: MachineConfig[]
    kinematicsConfiguration?: KinematicsConfigurationConfig[]
    moveParameters?: MoveParametersConfig[]
    joint?: JointConfig[]
    frames?: FramesConfig[]
    task?: TaskConfig[]
    activity?: ActivityConfig[]
    dout?: DoutConfig[]
    aout?: AoutConfig[]
    iout?: IoutConfig[]
    din?: DinConfig[]
    ain?: AinConfig[]
    iin?: IinConfig[]
    fieldbus?: FieldbusConfig[]
    spindle?: SpindleConfig[]
    tool?: ToolConfig[]
}

export type GlowbuzzerMachineStatus = MachineStatus & {
    /** Indicates if an error has occurred. */
    error?: boolean
    /** The error message if an error has occurred. */
    message?: string

    controlWord?: number
}

export type GlowbuzzerStatus = {
    /**
     * Provides information about activities that are being streamed to GBC.
     *
     * The read and write counts are used to know if the GBC has had a chance to process any stream
     * items since the last status message, and thus whether the capacity should be seen as updated or stale.
     * If the read count has changed, GBC has taken some of the items sent into its internal queue. If the write count
     * has changed, GBC has accepted the last items sent. Only if both change is it safe to stream
     * more items in accordance with the current capacity.
     */
    stream: {
        /** Capacity of the stream buffer. You must not send more than this number of activities in a single message. */
        capacity: number
        /** The current state of the stream. */
        state: STREAMSTATE
        /** The tag of of the currently executing activity. */
        tag: number
        /** The total time the stream has been active, in machine cycles. */
        time: number
        /** The number of activities read from the stream buffer. */
        readCount: number
        /** The number of activities written to the stream buffer. */
        writeCount: number
    }
    /**
     * Provides information about the current state of the machine, activities, joints, kinematics configurations, IO and tasks.
     */
    status: {
        /** The current state of the machine. */
        machine: GlowbuzzerMachineStatus
        /** The current state of solo activities. */
        activity: ActivityStatus[]
        /** The current state of all joints. */
        joint: (JointStatus & Pick<JointCommand, "controlWord">)[]
        /** The current state of all kinematics configurations. */
        kc: (KinematicsConfigurationStatus & {
            position: Pick<CartesianPosition, "translation" | "rotation">
            offset: Vector3
            limitsDisabled: boolean
        })[]
        /** The current state of all analog inputs. */
        ain: AinStatus[]
        /** The current state of all integer inputs. */
        iin: IinStatus[]
        /** The current state of all digital inputs. */
        din: DinStatus[]
        /** The current state of all analog outputs. */
        aout: (AoutStatus & AoutCommand)[]
        /** The current state of all integer outputs. */
        iout: (IoutStatus & IoutCommand)[]
        /** The current state of all digital outputs. */
        dout: (DoutStatus & DoutCommand)[]
        /** The current state of all tasks. */
        tasks: TaskStatus[]
    }
}
