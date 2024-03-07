/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    GlowbuzzerConfig,
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    KC_KINEMATICSCONFIGURATIONTYPE
} from "@glowbuzzer/store"
import { spindle } from "../../../../test/src/tests/spindle"
import { activity } from "../../../../test/src/tests/activity"

const DEFAULT_LINEAR_LIMITS = {
    vmax: 200,
    amax: 4000,
    jmax: 80000
}
export const config: GlowbuzzerConfig = {
    machine: [
        {
            name: "GENERIC CARTESIAN",
            busCycleTime: 4
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
    joint: [
        {
            name: "0",
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            jointType: JOINT_TYPE.JOINT_PRISMATIC,
            limits: [DEFAULT_LINEAR_LIMITS],
            scale: 100000
        },
        {
            name: "1",
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            jointType: JOINT_TYPE.JOINT_PRISMATIC,
            limits: [DEFAULT_LINEAR_LIMITS],
            scale: 100000
        },
        {
            name: "2",
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_CONTINUOUS,
            jointType: JOINT_TYPE.JOINT_PRISMATIC,
            limits: [DEFAULT_LINEAR_LIMITS],
            scale: 100000
        }
    ],
    kinematicsConfiguration: [
        {
            name: "Default",
            frameIndex: 1,
            participatingJoints: [0, 1, 2],
            participatingJointsCount: 3,
            kinematicsConfigurationType: KC_KINEMATICSCONFIGURATIONTYPE.KC_CARTESIAN,
            extentsX: [-1000, 1000],
            extentsY: [-1000, 1000],
            extentsZ: [-1000, 1000],
            linearLimits: [
                {
                    vmax: 50,
                    amax: 200,
                    jmax: 4000
                },
                {
                    vmax: 100,
                    amax: 400,
                    jmax: 8000
                }
            ],
            angularLimits: [
                {
                    vmax: 100,
                    amax: 1000,
                    jmax: 10000
                }
            ]
        }
    ],
    din: [{}, {}, {}, {}],
    dout: [
        {
            name: "Spindle Enable"
        },
        {
            name: "Spindle Direction"
        }
    ],
    ain: [
        {
            name: "AIN 0"
        },
        {
            name: "AIN 1"
        }
    ],
    aout: [
        {
            name: "AOUT 0"
        },
        {
            name: "AOUT 1"
        }
    ],
    iin: [
        {
            name: "IIN 0"
        },
        {
            name: "IIN 1"
        }
    ],
    iout: [
        {
            name: "IOUT 0"
        },
        {
            name: "IOUT 1"
        }
    ],
    fieldbus: [
        {
            name: "0",
            jointCount: 10,
            RxPdo: {
                machineStatusWordOffset: 0,
                activeFaultOffset: 4,
                faultHistoryOffset: 8,
                heartbeatOffset: 12,
                jointStatuswordOffset: 16,
                jointActualPositionOffset: 36,
                jointActualVelocityOffset: 76,
                jointActualTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 8,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            },
            TxPdo: {
                machineControlWordOffset: 0,
                gbcControlWordOffset: 4,
                hlcControlWordOffset: 8,
                heartbeatOffset: 12,
                jointControlwordOffset: 16,
                jointSetPositionOffset: 36,
                jointSetVelocityOffset: 76,
                jointSetTorqueOffset: 116,
                digitalOffset: 156,
                digitalCount: 10,
                analogOffset: 164,
                analogCount: 6,
                integerOffset: 188,
                integerCount: 2
            }
        }
    ],
    frames: [
        {
            name: "World",
            workspaceOffset: 2
        },
        {
            name: "Spindle",
            translation: {
                z: 200
            },
            rotation: {
                x: 1,
                y: 0,
                z: 0,
                w: 0
            }
        },
        {
            name: "Part",
            workspaceOffset: 1,
            translation: {
                z: 20
            }
        },
        {
            name: "Tool Changer",
            translation: {
                x: -400,
                y: 200,
                z: 50
            }
        }
    ],
    points: [
        {
            name: "Origin"
        },
        {
            name: "X10",
            translation: {
                x: 10
            }
        },
        {
            name: "R90",
            rotation: {
                x: 0.7071068,
                y: 0,
                z: 0,
                w: 0.7071068
            }
        }
    ],
    tool: [
        {
            name: "Unused",
            diameter: 10,
            translation: {
                z: 0
            }
        },
        {
            name: "Unused",
            diameter: 10,
            translation: {
                z: 0
            }
        },
        {
            name: "Unused",
            diameter: 10,
            translation: {
                z: 0
            }
        },
        {
            name: "drill 18mm",
            diameter: 18,
            translation: {
                z: 241
            }
        },
        {
            name: "Renishaw OMP 40-2",
            diameter: 40,
            translation: {
                z: 103
            }
        },
        {
            name: "end mill 5mm",
            diameter: 5,
            translation: {
                z: 35
            }
        },
        {
            name: "insert face mill 80mm",
            diameter: 80,
            translation: {
                z: 60
            }
        },
        {
            name: "M12_Tap",
            diameter: 12,
            translation: {
                z: 110
            }
        },
        {
            name: "insert end mill 10mm",
            diameter: 10,
            translation: {
                z: 35
            }
        }
    ],
    spindle: [
        {
            name: "Default",
            enableDigitalOutIndex: 0,
            directionDigitalOutIndex: 1,
            directionInvert: false,
            speedAnalogOutIndex: 0
        }
    ],
    moveParameters: [
        {
            name: "Default",
            amaxPercentage: 100,
            vmaxPercentage: 100,
            jmaxPercentage: 100,
            blendTimePercentage: 60,
            blendTolerance: 20,
            blendType: 0,
            limitConfigurationIndex: 0,
            toolIndex: 1
        }
    ],
    task: [
        {
            name: "MyTask",
            activityCount: 2,
            firstActivityIndex: 0
        }
    ],
    activity: [
        {
            name: "move joints at speed 10",
            activityType: 4,
            moveJointsAtVelocity: {
                jointVelocityArray: [10, 10, 10],
                kinematicsConfigurationIndex: 0,
                moveParamsIndex: 0
            }
        },
        {
            name: "dwell for 20",
            activityType: 13,
            dwell: {
                msToDwell: 20
            }
        }
    ]
}
