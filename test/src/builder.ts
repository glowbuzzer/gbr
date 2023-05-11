/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GbcTest } from "./framework"
import {
    FramesConfig,
    GlowbuzzerConfig,
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE
} from "../../libs/store/src"

const DEFAULT_FIELDBUS_CONFIG = {
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

export class ConfigBuilder {
    private readonly framework: GbcTest
    private json: GlowbuzzerConfig

    constructor(framework: GbcTest) {
        this.framework = framework
        this.json = {
            machine: [
                {
                    name: "default",
                    busCycleTime: 4
                }
            ],
            fieldbus: [DEFAULT_FIELDBUS_CONFIG],
            stream: [
                {
                    name: "default",
                    enableEndProgram: true
                },
                {
                    name: "other"
                }
            ],
            soloActivity: [
                {
                    name: "0"
                }
            ],
            moveParameters: [
                {
                    name: "default",
                    vmaxPercentage: 100,
                    amaxPercentage: 100,
                    jmaxPercentage: 100
                }
            ],
            frames: [
                {
                    name: "default",
                    translation: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                }
            ],
            din: [{ name: "0" }],
            dout: [{ name: "0" }],
            ain: [{ name: "0" }],
            aout: [{ name: "0" }],
            iin: [{ name: "0" }],
            iout: [{ name: "0" }],
            tool: [
                {
                    name: "default"
                }
            ]
        }
    }

    public finalize(restoreJoints = false) {
        return this.framework.reset_from_json(this.json, restoreJoints)
    }

    joints(number: number) {
        this.json.joint = Array.from({ length: number }, (_, i) => ({
            name: "joint" + i,
            limits: [
                {
                    vmax: 200,
                    amax: 4000,
                    jmax: 80000
                }
            ],
            scale: 1000000
        }))
        return this
    }

    cartesianKinematics() {
        this.json.kinematicsConfiguration = [
            {
                name: "cartesian",
                frameIndex: 0,
                participatingJoints: [0, 1, 2],
                participatingJointsCount: 3,
                kinematicsConfigurationType: 4,
                extentsX: [-100, 100],
                linearLimits: [
                    {
                        vmax: 200,
                        amax: 4000,
                        jmax: 80000
                    }
                ]
            }
        ]
        return this
    }

    robotKinematics() {
        // ensure joints are revolute with nice big limits
        this.json.joint = this.json.joint.map(j => ({
            ...j,
            negLimit: -720,
            posLimit: 720,
            finiteContinuous: JOINT_FINITECONTINUOUS.JOINT_FINITE,
            jointType: JOINT_TYPE.JOINT_REVOLUTE
        }))
        this.json.kinematicsConfiguration = [
            {
                name: "default",
                frameIndex: 0,
                participatingJoints: [0, 1, 2, 3, 4, 5],
                participatingJointsCount: 6,
                kinematicsConfigurationType: 1,
                extentsX: [-1000, 1000],
                extentsY: [-1000, 1000],
                extentsZ: [-1000, 1000],
                linearLimits: [
                    {
                        vmax: 2000,
                        amax: 40000,
                        jmax: 800000
                    }
                ],
                angularLimits: [
                    {
                        vmax: 100,
                        amax: 1000,
                        jmax: 10000
                    }
                ],
                kinChainParams: {
                    numRows: 6,
                    numCols: 5,
                    data: [
                        -90, 0, 0, 0, 0, 0, 0, -90, 225, 0, 90, 0, 90, 0, 35, -90, 0, 0, 0, 225, 90,
                        0, 0, 0, 0, 0, 0, 0, 0, 65
                    ]
                }
            }
        ]
        return this
    }

    addFrame(param: FramesConfig) {
        this.json.frames.push(param)
        return this
    }

    tasks(...params) {
        this.json.task = params
        return this
    }

    activities(...params) {
        this.json.activity = params
        return this
    }

    digitalInputs(number: number) {
        this.json.din = Array.from({ length: number }, (_, i) => ({
            name: "din" + i
        }))
        return this
    }

    addTool(length: number) {
        this.json.tool.push({
            translation: {
                z: length
            }
        })
        return this
    }
}
