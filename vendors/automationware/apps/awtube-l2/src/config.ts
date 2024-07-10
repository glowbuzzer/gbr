/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    GlowbuzzerConfig,
    JOINT_MODEOFOPERATION,
    JOINT_TORQUE_MODE,
    KC_KINEMATICSCONFIGURATIONTYPE,
    SafetyDinConfig,
    WithNameAndDescription
} from "@glowbuzzer/store"
import {
    AwTubeL2InverseDynamicParams,
    AwTubeL2KinChainParams,
    StandardAwTubeConfiguration
} from "@glowbuzzer/awlib"

const safety_dins = `
0\tsafety_state
1\tsafety_error
2\trestart_ack_needed
3\tpause_motion
4\treduce_speed
5\tsafe_pos_valid
6\tkeyswitch
7\tdeadman
8\tmute_safety_function
9\tactive_fault_machine_swm
10\tactive_fault_machine_sls
11\tactive_fault_machine_slp
12\tactive_fault_pause_violation
13\tactive_fault_drive_drives_sto
14\tactive_fault_drive_drives_sos
15\tactive_fault_drive_drives_ss1
16\tactive_fault_drive_drives_ss2
17\tactive_fault_drive_drives_sls1
18\tactive_fault_drive_drives_sbc
19\tactive_fault_drive_drives_over_temp`

const safety_din_array: WithNameAndDescription<SafetyDinConfig>[] = safety_dins
    .trim()
    .split("\n")
    .map(line => {
        const [, name] = line.trim().split("\t")
        return { name }
    })

const DEFAULT_LIMITS = [
    {
        vmax: 0.1,
        amax: 1,
        jmax: 2
    }
]
/**
 * This is the configuration for the AWTUBE L machine that can be pushed to the control if needed
 * (for example on first start)
 */
export const config: GlowbuzzerConfig = {
    ...StandardAwTubeConfiguration,
    machine: [
        {
            name: "AWTUBE L2",
            busCycleTime: 4,
            heartbeatTimeout: 15000,
            statusFrequency: 150,
            $metadata: {
                autoModeEnabledInput: {
                    safety: true,
                    index: 6
                },
                motionEnabledInput: {
                    safety: true,
                    index: 7
                },
                manualModeBit1Output: {
                    safety: true,
                    index: 0
                },
                manualModeBit2Output: {
                    safety: true,
                    index: 1
                },
                safeStopInput: {
                    safety: true,
                    index: 3
                }
            }
        }
    ],

    safetyDin: safety_din_array,
    ain: [
        {
            name: "Analog 1"
        }
    ],
    iin: [
        {
            name: "Integer 1"
        }
    ],
    uiin: [
        {
            name: "Unsigned Int 1"
        }
    ],
    externalIin: [
        {
            name: "External Int 1"
        }
    ],
    externalUiin: [
        {
            name: "External Unsigned Int 1"
        }
    ],
    aout: [
        {
            name: "default"
        }
    ],
    iout: [
        {
            name: "default"
        }
    ],
    uiout: [
        // {
        //     name: "default"
        // }
    ],
    externalDout: [
        {
            name: "default"
        }
    ],
    externalIout: [
        {
            name: "default"
        }
    ],
    externalUiout: [
        {
            name: "default"
        }
    ],
    points: [
        {
            name: "point1",
            frameIndex: 0,
            translation: {
                x: 210,
                y: 210,
                z: 400
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            },
            configuration: 0
        }
    ],
    frames: [
        {
            name: "World",
            translation: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1
            }
        },
        {
            name: "Robot",
            translation: {
                x: 0,
                y: 0,
                z: 117
            }
        }
    ],
    joint: [
        {
            name: "0",
            limits: DEFAULT_LIMITS,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 3.414,
            jointType: 1,
            negLimit: -200,
            posLimit: 200,
            inverted: true,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes:
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY |
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT
        },
        {
            name: "1",
            limits: DEFAULT_LIMITS,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 2.54,
            jointType: 1,
            negLimit: -200,
            posLimit: 200,
            inverted: true,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes: JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY
        },
        {
            name: "2",
            limits: DEFAULT_LIMITS,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 3.41,
            jointType: 1,
            negLimit: -200,
            posLimit: 200,
            inverted: false,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes: JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY
        },
        {
            name: "3",
            limits: DEFAULT_LIMITS,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 4.3,
            jointType: 1,
            negLimit: -200,
            posLimit: 200,
            inverted: true,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes:
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY |
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT
        },
        {
            name: "4",
            limits: DEFAULT_LIMITS,
            scalePos: 166886,
            scaleVel: 9549,
            scaleTorque: 4.3,
            jointType: 1,
            negLimit: -200,
            posLimit: 200,
            inverted: true,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes: JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY
        },
        {
            name: "5",
            limits: DEFAULT_LIMITS,
            scalePos: 166886 * 51,
            scaleVel: 9549,
            scaleTorque: 16.07,
            jointType: 1,
            negLimit: -360,
            posLimit: 360,
            inverted: true,
            dynamicsVelocityThreshold: 0.02,
            preferredMode: JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP,
            supportedModes:
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CSP |
                JOINT_MODEOFOPERATION.JOINT_MODEOFOPERATION_CST,
            supportedTorqueModes:
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_GRAVITY |
                JOINT_TORQUE_MODE.JOINT_TORQUE_MODE_DIRECT
        }
    ],
    kinematicsConfiguration: [
        {
            name: "default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_SIXDOF,
            supportedConfigurationBits: 7,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [-1000, 1500],
            linearLimits: [
                {
                    vmax: 600 * 0.1,
                    amax: 3000 * 0.1,
                    jmax: 60000 * 0.1
                }
            ],
            angularLimits: DEFAULT_LIMITS,
            ...AwTubeL2KinChainParams,
            inverseDynamicParams: AwTubeL2InverseDynamicParams
        }
    ],
    serial: [
        {
            name: "default"
        }
    ],
    tool: [
        {
            name: "t1",
            rigidBodyInertia: {
                m: 1.1,
                h: {
                    x: 0,
                    y: 0,
                    z: 0
                }
                // Ixx: 0.10033,
                // Iyy: 0.098412,
                // Izz: 0.072655,
                // Ixy: 0.00004912,
                // Ixz: 0.00009505,
                // Iyz: 0.00059172
            }
        }
    ]
}
