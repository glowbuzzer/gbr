/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GbcTest } from "./framework"
import {
    EnvelopeConstraint,
    FramesConfig,
    GlowbuzzerConfig,
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    Quat,
    SpindleConfig,
    TaskConfig
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
            ],
            spindle: []
        }
    }

    public finalize(restoreJoints = false) {
        return this.framework.reset_from_json(this.json, restoreJoints)
    }

    joints(number: number, limits = { vmax: 200, amax: 4000, jmax: 80000 }) {
        this.json.joint = Array.from({ length: number }, (_, i) => ({
            name: "joint" + i,
            limits: [limits],
            scale: 1000000
        }))
        return this
    }

    scaleJoints(v: number) {
        this.json.joint.forEach(j => (j.scale = v))
        return this
    }

    linearLimits(vmax: number, amax: number, jmax: number, kinematicsConfigurationIndex = 0) {
        this.json.kinematicsConfiguration[kinematicsConfigurationIndex].linearLimits = [
            {
                vmax,
                amax,
                jmax
            }
        ]
        return this
    }

    cartesianKinematics(
        frameIndex = 0,
        limits = {
            vmax: 200,
            amax: 4000,
            jmax: 80000
        }
    ) {
        const jointCount = this.json.joint.length || 3
        this.json.kinematicsConfiguration = [
            {
                name: "cartesian",
                frameIndex,
                participatingJoints: Array.from({ length: jointCount }, (_, i) => i),
                participatingJointsCount: jointCount,
                kinematicsConfigurationType: 4,
                linearLimits: [limits]
            }
        ]
        return this
    }

    scaleKinematics(v: number, kc = 0) {
        this.json.kinematicsConfiguration[kc].scaleX = v
        this.json.kinematicsConfiguration[kc].scaleY = v
        this.json.kinematicsConfiguration[kc].scaleZ = v
        return this
    }

    robotKinematics(frameIndex = 0) {
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
                frameIndex,
                participatingJoints: [0, 1, 2, 3, 4, 5],
                participatingJointsCount: 6,
                kinematicsConfigurationType: 1,
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

    addSpindle(param: SpindleConfig) {
        this.json.spindle.push(param)
        return this
    }

    setFrame(index: number, param: FramesConfig) {
        this.json.frames[index] = param
        return this
    }

    tasks(...params: TaskConfig[]) {
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

    digitalOutputs(number: number) {
        this.json.dout = Array.from({ length: number }, (_, i) => ({
            name: "dout" + i
        }))
        return this
    }

    addTool(length: number, x = 0, rotation: Quat = { x: 0, y: 0, z: 0, w: 1 }) {
        this.json.tool.push({
            translation: {
                x,
                y: 0,
                z: length
            },
            rotation
        })
        return this
    }

    envelopeConstraints(...constraints: EnvelopeConstraint[]) {
        this.json.kinematicsConfiguration[0].envelopeConstraints = constraints
        return this
    }

    // limitZ(min: number, max: number, kinematicsConfigurationIndex = 0) {
    //     this.json.kinematicsConfiguration[kinematicsConfigurationIndex].extentsZ = [min, max]
    //     return this
    // }
    //
    // cylindricalEnvelope(
    //     innerRadius: number,
    //     outerRadius: number,
    //     kinematicsConfigurationIndex = 0
    // ) {
    //     this.json.kinematicsConfiguration[kinematicsConfigurationIndex].cylindricalEnvelope = [
    //         innerRadius,
    //         outerRadius
    //     ]
    //     return this
    // }
    //
    // sphericalEnvelope(innerRadius: number, outerRadius: number, kinematicsConfigurationIndex = 0) {
    //     this.json.kinematicsConfiguration[kinematicsConfigurationIndex].sphericalEnvelope = {
    //         radius: [innerRadius, outerRadius]
    //     }
    //     return this
    // }
}
