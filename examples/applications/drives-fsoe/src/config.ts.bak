/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    DIN_SAFETY_TYPE,
    GlowbuzzerConfig,
    JOINT_MODEOFOPERATION,
    JOINT_TORQUE_MODE,
    KC_KINEMATICSCONFIGURATIONTYPE
} from "@glowbuzzer/store"

export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "DRIVES FSoE CONFIG",
            busCycleTime: 4
        }
    ],
    joint: [
        {
            name: "J1",
            limits: [
                {
                    vmax: 0.25,
                    amax: 2,
                    jmax: 4
                }
            ],
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 4.3,
            jointType: 1,
            pidConfig: [
                {
                    kp: 0.001,
                    ki: 0.0,
                    kd: 0.0,
                    maxIntegral: 2000,
                    minIntegral: -2000,
                    sampleTime: 20
                }
            ],
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSV,
            supportedTorqueModes:
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY |
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT
        },
        {
            name: "J2",
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 32.68
        },
        {
            name: "J3",
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 100000
        }
    ],
    frames: [
        {
            name: "default"
        }
    ],
    stream: [
        {
            name: "default"
        }
    ],
    soloActivity: [
        {
            name: "default"
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            participatingJointsCount: 3,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_NAKED,
            participatingJoints: [0, 1, 2],
            linearLimits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            inverseDynamicParams: [
                { jointInertia: 4.0, damping: 25.0, friction: 16.0 },
                { jointInertia: 1.2, damping: 2.2, friction: 3.2 },
                { jointInertia: 1.3, damping: 2.3, friction: 3.3 }
            ]
        }
    ],
    din: [
        {
            name: "My din",
            description: "EL2008 slave 1 input 0",
            inverted: true
        },
        {
            name: "My din 2",
            description: "EL2008 slave 1 input 1",
            inverted: false
        }
    ],
    dout: [
        {
            name: "My dout",
            description: "EL2008 slave 1 output 0"
        },
        {
            name: "My dout 2",
            description: "EL2008 slave 1 output 1"
        }
    ],
    uiin: [
        {
            name: "My uiin",
            description: "ELxxx slave 1 input 2"
        },
        {
            name: "My uiin 2",
            description: "ELxxx slave 1 input 3"
        }
    ],
    iin: [
        {
            name: "My iin",
            description: "ELxxx slave 1 input 4"
        },
        {
            name: "My iin 2",
            description: "ELxxx slave 1 input 5"
        }
    ],
    iout: [
        {
            name: "My iout",
            description: "ELxxx slave 1 output 0"
        },
        {
            name: "My iout 2",
            description: "ELxxx slave 1 output 1"
        }
    ],
    uiout: [
        {
            name: "My uiout",
            description: "ELxxx slave 1 output 2"
        },
        {
            name: "My uiout 2",
            description: "ELxxx slave 1 output 3"
        }
    ],
    safetyDin: [
        {
            name: "Overall safety state (0)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_OVERALL_STATE
        },
        {
            name: "Safety error state (1)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_RESERVED
        },
        {
            name: "Restart acknowledge state (2)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_RESERVED
        },
        {
            name: "Drive - STO (3)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - SOS (4)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - SS1 (5)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - SS2 (6)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - SLS1 (7)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - SBC (8)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE
        },
        {
            name: "Drive - Over temperature (9)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_UNACKNOWLEDGEABLE
        },
        {
            name: "Drive - Safe pos valid (10)",
            type: DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_SAFE_POS_VALID
        },
        {
            name: "Safety PLC - CW SLP (11)"
        },
        {
            name: "Safety PLC - CCW SLP (12)"
        }
    ],
    safetyDout: [
        {
            name: "Control alive (cmd) (1)"
        },
        {
            name: "Drive SS1 (cmd) (2)"
        },
        {
            name: "Drive SS0 (cmd) (3)"
        },
        {
            name: "Drive SS2 (cmd) (4)"
        },
        {
            name: "Drive Reset Pos (cmd) (5)"
        }
    ],
    modbusDin: [
        {
            name: "Temperature sensor",
            slave_num: 0x2,
            address: 0x2,
            function: 0x1
        },
        {
            name: "Part in position 1",
            slave_num: 0x2,
            address: 0x6,
            function: 0x1
        },
        {
            name: "Part in position 2",
            slave_num: 0x2,
            address: 0x9,
            function: 0x1
        },
        {
            name: "Part in position 3",
            slave_num: 0x2,
            address: 0x7,
            function: 0x1
        },
        {
            name: "Part in position 4",
            slave_num: 0x2,
            address: 0x8,
            function: 0x1
        }
    ],
    modbusUiin: [
        {
            name: "F/T sensor Fx",
            slave_num: 1,
            address: 10,
            function: 3
        },
        {
            name: "F/T sensor Fy",
            slave_num: 1,
            address: 11,
            function: 3
        },
        {
            name: "F/T sensor Fz",
            slave_num: 1,
            address: 12,
            function: 3
        },
        {
            name: "F/T sensor Tx",
            slave_num: 1,
            address: 13,
            function: 3
        },
        {
            name: "F/T sensor Ty",
            slave_num: 1,
            address: 14,
            function: 3
        }
    ],
    modbusDout: [
        {
            name: "Grippper 1",
            slave_num: 2,
            start_address: 10,
            end_address: 10
        },
        {
            name: "Grippper 2",
            slave_num: 2,
            start_address: 12,
            end_address: 13
        },
        {
            name: "Conveyor actuate",
            slave_num: 2,
            start_address: 15,
            end_address: 17
        }
    ],
    modbusUiout: [
        {
            name: "Gripper position",
            slave_num: 1,
            start_address: 1,
            end_address: 1
        },
        {
            name: "Gripper force",
            slave_num: 1,
            start_address: 2,
            end_address: 4
        },
        {
            name: "Gripper LED",
            slave_num: 1,
            start_address: 6,
            end_address: 9
        }
    ]
}
