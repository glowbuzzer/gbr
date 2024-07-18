/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    ActivityConfig,
    ActivityStatus,
    AinConfig,
    AoutCommand,
    AoutConfig,
    AoutStatus,
    CartesianPosition,
    DinCommand,
    DinConfig,
    DinStatus,
    DoutCommand,
    DoutConfig,
    DoutStatus,
    ExternalDinConfig,
    ExternalDoutConfig,
    ExternalIinConfig,
    ExternalIoutConfig,
    ExternalUiinConfig,
    ExternalUioutConfig,
    FramesConfig,
    IinConfig,
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
    ModbusDinConfig,
    ModbusDinStatus,
    ModbusDoutConfig,
    ModbusUiinConfig,
    ModbusUiinStatus,
    ModbusUioutConfig,
    MoveParametersConfig,
    PointsConfig,
    SafetyDinCommand,
    SafetyDinConfig,
    SafetyDinStatus,
    SafetyDoutCommand,
    SafetyDoutConfig,
    SafetyDoutStatus,
    SerialConfig,
    SerialStatus,
    SoloActivityConfig,
    SpindleConfig,
    StreamConfig,
    STREAMSTATE,
    TaskConfig,
    TaskStatus,
    ToolConfig,
    UiinConfig,
    UioutConfig
} from "./gbc"

// contains additional types that should be included in the generated typedoc, eg. config type and status type

// export type WithName<T> = T & { name?: string }
//
// // export type WithDescription<T> = T & { description?: string }
//
// type WithNameForArrayElements<T> = {
//     [P in keyof T]: T[P] extends Array<infer U> ? WithName<U>[] : T[P]
// }

export type WithNameAndDescription<T> = T & { name?: string; description?: string }

type WithNameAndDescriptionForArrayElements<T> = {
    [P in keyof T]: T[P] extends Array<infer U> ? WithNameAndDescription<U>[] : T[P]
}

type WithMetadata<T, M> = T & {
    $metadata?: M
}

export type SafetyIoMetadata = {
    0?: string
    1?: string
    negativeState?: number
}

export type SafetyInputMetadata = SafetyIoMetadata & {
    type?: "acknowledgeable" | "unacknowledgeable"
}

type MachineIoItem = {
    safety?: boolean
    index: number
}

export type MachineMetadata = {
    /** The input that indicates that machine is in a safe state */
    safetyStateInput?: MachineIoItem
    /** The input that indicates that hardware reset is needed */
    resetNeededInput?: MachineIoItem
    /** The input that should be used to determine whether auto mode is enabled (for example, keyswitch state) */
    autoModeEnabledInput?: MachineIoItem
    /** The input that should be used to determine whether motion is enabled in menual mode (for example, deadman pressed) */
    motionEnabledInput?: MachineIoItem
    /** The input that indicates the machine is in a safe stop state */
    safeStopInput?: MachineIoItem
    /** The input that should be used to determine whether the machine is in override mode (safety functions muted) */
    overrideEnabledInput?: MachineIoItem
    /** The input that should be used to determine whether the drive safe positions are valid */
    drivesSafePositionValidInput?: MachineIoItem
    /** The input that should be used to determine whether any drives are in STO state */
    anyJointStoInput?: MachineIoItem
    /** The input that should be used to determine whether any joints are in SS1 state */
    anyJointSs1Input?: MachineIoItem
    /** The input that should be used to determine whether any joints are in SS2 state */
    anyJointSs2Input?: MachineIoItem
    /** The input that should be used to determine whether any joints are in SBC state */
    anyJointSbcInput?: MachineIoItem
    /** The input that should be used to determine whether any joints are in SOS state */
    anyJointSosInput?: MachineIoItem
    /** The input that should be used to determine whether any drives are over temperature */
    drivesOverTempInput?: MachineIoItem
    /** The input that should be used to determine whether any drives are in error state */
    drivesErrorInput?: MachineIoItem
    /** The input that should be used to determine whether TCP position is in SLS fault state */
    faultTcpSlsInput?: MachineIoItem
    /** The input that should be used to determine whether TCP position is in SWM fault state */
    faultTcpSwmInput?: MachineIoItem
    /** The input that should be used to determine whether joints are in SLP fault state */
    faultJointsSlpInput?: MachineIoItem
    /** The input that should be used to determine whether a pause was violated by motion */
    faultPauseViolationInput?: MachineIoItem
    /** The input that should be used to determine whether one or more estop conditions are active */
    estopStateInput?: MachineIoItem
    /** The output that should be used as the first bit of the manual mode, when manual mode active */
    manualModeBit1Output?: MachineIoItem
    /** The output that should be used as the second bit of the manual mode, when manual mode active */
    manualModeBit2Output?: MachineIoItem
    /** The output that should be used as the third bit of the manual mode, when manual mode active */
    manualModeBit3Output?: MachineIoItem
    /** The output that must be set to reset the drives safe position */
    drivesSafePositionResetOutput?: MachineIoItem
}

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
export type GlowbuzzerConfig = WithNameAndDescriptionForArrayElements<{
    machine?: WithMetadata<MachineConfig, MachineMetadata>[]
    kinematicsConfiguration?: KinematicsConfigurationConfig[]
    moveParameters?: MoveParametersConfig[]
    joint?: JointConfig[]
    frames?: FramesConfig[]
    points?: PointsConfig[]
    task?: TaskConfig[]
    activity?: ActivityConfig[]
    stream?: StreamConfig[]
    soloActivity?: SoloActivityConfig[]
    dout?: DoutConfig[]
    aout?: AoutConfig[]
    iout?: IoutConfig[]
    uiout?: UioutConfig[]
    din?: DinConfig[]
    safetyDin?: WithMetadata<SafetyDinConfig, SafetyInputMetadata>[]
    safetyDout?: WithMetadata<SafetyDoutConfig, SafetyIoMetadata>[]
    modbusDin?: ModbusDinConfig[]
    ain?: AinConfig[]
    iin?: IinConfig[]
    uiin?: UiinConfig[]
    spindle?: SpindleConfig[]
    tool?: ToolConfig[]
    externalDin?: ExternalDinConfig[]
    externalIin?: ExternalIinConfig[]
    externalUiin?: ExternalUiinConfig[]
    modbusUiin?: ModbusUiinConfig[]
    externalDout?: ExternalDoutConfig[]
    modbusDout?: ModbusDoutConfig[]
    modbusUiout?: ModbusUioutConfig[]
    externalIout?: ExternalIoutConfig[]
    externalUiout?: ExternalUioutConfig[]
    serial?: SerialConfig[]
}>

export type GlowbuzzerMachineStatus = MachineStatus & {
    /** The error message if an error has occurred. */
    operationErrorMessage?: string // hack to override string array from codegen

    controlWord?: number
}

export type GlowbuzzerKinematicsConfigurationStatus = Pick<
    KinematicsConfigurationStatus,
    | "isNearSingularity"
    | "limitsDisabled"
    | "froActual"
    | "froTarget"
    | "configuration"
    | "toolIndex"
> & {
    position: Pick<CartesianPosition, "translation" | "rotation">
    offset: Pick<CartesianPosition, "translation" | "rotation">
}

export type AnalogOutputStatus = Required<AoutStatus & AoutCommand>
export type IntegerOutputStatus = Required<IoutStatus & IoutCommand>
export type DigitalOutputStatus = Required<DoutStatus & DoutCommand>
export type SafetyDigitalOutputStatus = Required<SafetyDoutStatus & SafetyDoutCommand>

export type DigitalInputStatus = Required<DinStatus & DinCommand>
export type SafetyDigitalInputStatus = Required<SafetyDinStatus & SafetyDinCommand>

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
        /** Number of items currently in the stream buffer. */
        queued: number
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
    }[]
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
        kc: GlowbuzzerKinematicsConfigurationStatus[]
        /** The current state of all analog inputs. */
        ain: number[]
        /** The current state of all integer inputs. */
        iin: number[]
        /** The current state of all unsigned integer inputs. */
        uiin: number[]
        /** The current state of all modbus unisgned interger inputs. */
        modbusUiin: ModbusUiinStatus[]
        /** The current state of all digital inputs. */
        din: DinStatus[]
        /** The current state of all safe digital inputs. */
        // safetyDin: boolean[]
        safetyDin: SafetyDinStatus[]
        /** The current state of all modbus digital inputs. */
        modbusDin: ModbusDinStatus[]
        /** The current state of all analog outputs. */
        aout: AnalogOutputStatus[]
        /** The current state of all integer outputs. */
        iout: IntegerOutputStatus[]
        /** The current state of all unsigned integer outputs. */
        uiout: IntegerOutputStatus[]
        /** The current state of all digital outputs. */
        dout: DigitalOutputStatus[]
        /** The current state of all safe digital outputs. */
        safetyDout: SafetyDigitalOutputStatus[]
        /** The current state of all tasks. */
        tasks: TaskStatus[]
        /** The current state of external IO. */
        external: {
            /** The current state of external integer inputs. */
            iin: number[]
            /** The current state of external unsigned integer inputs. */
            uiin: number[]
            /** The current state of external digital inputs. */
            din: boolean[]
            /** The current state of external integer outputs. */
            iout: IntegerOutputStatus[]
            /** The current state of external unsigned integer outputs. */
            uiout: IntegerOutputStatus[]
            /** The current state of external digital outputs. */
            dout: DigitalOutputStatus[]
        }
        serial?: SerialStatus
    }
    telemetry: {
        // timestamp
        t: number
        // these are the telemetry buffer capacities, only used during development and not sent by GBC unless enabled
        // m7cap: number
        // m4cap: number
        // m7wait: number

        // digital io
        di: number
        do: number
        // safety digital io
        sdi: number
        sdo: number

        // these are the set and act values on the joints
        set: { p: number; v: number; a: number; t: number; to: number }[]
        act: { p: number; v: number; t: number; e: number }[]
    }[]
    response: any // used for promise resolution
    emstat?: {
        /** EtherCAT master boot state, boot successful */
        bsbs?: boolean
    }
}
