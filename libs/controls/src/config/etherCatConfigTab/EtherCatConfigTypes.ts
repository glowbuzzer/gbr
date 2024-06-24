// Type for drive limits
export interface DriveLimits {
    position_limit_max: number
    position_limit_min: number
    velocity_limit: number
    torque_limit: number
    max_motor_speed: number
    max_motor_torque: number
}

// Type for drive configuration
export interface Drives {
    no_limits: boolean
    limits: DriveLimits[]
}

// Type for optional fields in slave configuration
export interface OptionalConfig {
    is_configurable: boolean
    is_enabled: boolean
}

// Type for Slave Data Object (SDO)
export interface Sdo {
    datatype: number
    index: number
    sub_index: number
    value: number
    length: number
}

// Type for slave configuration
export interface Slave {
    name: string
    eep_name: string
    optional: OptionalConfig
    sdos: Sdo[]
}

// Type for EtherCAT configuration
export interface Ethercat {
    ecm_cycle_shift: number
    slaves: Slave[]
}

// Type for GBEM parameters
export interface GbParams {
    cycle_time: number
    drive_state_change_timeout: number
}

// Type for GBEM debug parameters
export interface GbDebugParams {
    disable_drive_warn_check: boolean
    disable_drive_limit_check: boolean
}

// Type for GBEM configuration
export interface GbConfig {
    params: GbParams
    debug_params: GbDebugParams
}

// Root interface for the entire JSON object
export interface EtherCatConfig {
    machine_name: string
    sub_machine_name: string
    drives: Drives
    ethercat: Ethercat
    gbem: GbConfig
}

// Example file
export const exampleConfig: EtherCatConfig = {
    machine_name: "MACHINE_AW_6DOF",
    sub_machine_name: "L2",
    drives: {
        no_limits: false,
        limits: [
            {
                position_limit_max: 180,
                position_limit_min: -180,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 2500000,
                max_motor_torque: 4012
            },
            {
                position_limit_max: 180,
                position_limit_min: -180,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 1400000,
                max_motor_torque: 4056
            },
            {
                position_limit_max: 180,
                position_limit_min: -180,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 2500000,
                max_motor_torque: 4012
            },
            {
                position_limit_max: -180,
                position_limit_min: 180,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 2500000,
                max_motor_torque: 3991
            },
            {
                position_limit_max: -5,
                position_limit_min: -175,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 2500000,
                max_motor_torque: 3991
            },
            {
                position_limit_max: 3000,
                position_limit_min: -3000,
                velocity_limit: 50,
                torque_limit: 50,
                max_motor_speed: 3500000,
                max_motor_torque: 3991
            }
        ]
    },
    ethercat: {
        ecm_cycle_shift: 0,
        slaves: [
            {
                name: "EK1100",
                eep_name: "EK1100",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: []
            },
            {
                name: "EL2008",
                eep_name: "EL2008",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: []
            },
            {
                name: "EL1008",
                eep_name: "EL1008",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: []
            },
            {
                name: "EL6021",
                eep_name: "EL6021",
                optional: {
                    is_configurable: true,
                    is_enabled: true
                },
                sdos: [
                    {
                        datatype: 6,
                        index: 16499,
                        sub_index: 0,
                        value: 10,
                        length: 2
                    },
                    {
                        datatype: 6,
                        index: 16500,
                        sub_index: 0,
                        value: 3,
                        length: 2
                    },
                    {
                        datatype: 5,
                        index: 16501,
                        sub_index: 1,
                        value: 1,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 16501,
                        sub_index: 4,
                        value: 0,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 16501,
                        sub_index: 6,
                        value: 1,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_0",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_1",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_2",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_3",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_4",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            },
            {
                name: "IBT_JOINT_5",
                eep_name: "somanet",
                optional: {
                    is_configurable: false,
                    is_enabled: false
                },
                sdos: [
                    {
                        datatype: 4,
                        index: 24702,
                        sub_index: 0,
                        value: 1,
                        length: 4
                    },
                    {
                        datatype: 4,
                        index: 4102,
                        sub_index: 0,
                        value: 400,
                        length: 4
                    },
                    {
                        datatype: 5,
                        index: 8231,
                        sub_index: 2,
                        value: 15,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8720,
                        sub_index: 1,
                        value: 26,
                        length: 1
                    },
                    {
                        datatype: 5,
                        index: 8724,
                        sub_index: 1,
                        value: 2,
                        length: 1
                    }
                ]
            }
        ]
    },
    gbem: {
        params: {
            cycle_time: 4,
            drive_state_change_timeout: 5000
        },
        debug_params: {
            disable_drive_warn_check: false,
            disable_drive_limit_check: false
        }
    }
}
