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
    DinConfig,
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
    ModbusUiinConfig,
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
    PointsConfig,
    SafetyDinConfig,
    ModbusDinConfig,
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
    UioutConfig,
    ModbusDoutConfig,
    ModbusUiinStatus,
    ModbusDinStatus,
    ModbusUioutConfig
} from "./gbc"

// contains additional types that should be included in the generated typedoc, eg. config type and status type

export type WithName<T> = T & { name?: string }

type WithNameForArrayElements<T> = {
    [P in keyof T]: T[P] extends Array<infer U> ? WithName<U>[] : T[P]
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
export type GlowbuzzerConfig = WithNameForArrayElements<{
    machine?: MachineConfig[]
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
    safetyDout?: SafetyDoutConfig[]
    aout?: AoutConfig[]
    iout?: IoutConfig[]
    uiout?: UioutConfig[]
    din?: DinConfig[]
    safetyDin?: SafetyDinConfig[]
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
        din: boolean[]
        /** The current state of all safe digital inputs. */
        safetyDin: boolean[]
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
        m7cap: number
        m4cap: number
        m7wait: number
        // these are the set and act values on the joints
        set: { p: number; v: number; a: number; t: number; to: number }[]
        act: { p: number; v: number; t: number; e: number }[]
    }[]
    response: any // used for promise resolution
    emstat?: {
        machine_state: number
        shared_mem_busy_count: number
        ec_check_found_error: boolean
        drive_count: number
        drives: {
            name: string
            state: number
            error_message: string
        }[]
        slave_count: number
        slave_error_messages: string[]
    }
}
