/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useMemo } from "react"
import {
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    JointConfig,
    useJoint,
    usePrefs,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import styled from "styled-components"
import { MathUtils } from "three"
import { Button, Input, Slider } from "antd"
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { useLocalStorage } from "../../util/LocalStorageHook"
import { useJointsForKinematicsConfiguration } from "../../util/hooks"

const JointSliderDiv = styled.div`
    display: flex;
    gap: 10px;

    .ant-slider {
        flex-grow: 1;
        cursor: default;
    }

    .ant-slider-handle {
        display: none;
    }
`

const JointSliderReadonly = ({ jc, index }: { jc: JointConfig; index: number }) => {
    const joint = useJoint(index)

    const [min, max] =
        jc.jointType === JOINT_TYPE.JOINT_REVOLUTE
            ? // TODO: limits in config are in degrees (but shouldn't really be!)
              [MathUtils.degToRad(jc.negLimit), MathUtils.degToRad(jc.posLimit)]
            : [jc.negLimit, jc.posLimit]

    return (
        <Slider
            step={0.001}
            min={min}
            max={max}
            disabled
            value={
                jc.finiteContinuous === JOINT_FINITECONTINUOUS.JOINT_FINITE
                    ? joint?.actPos
                    : undefined
            }
            tooltip={{ open: false }}
        />
    )
}

type JogStepJointProps = {
    kinematicsConfigurationIndex: number
    // moveParams: MoveParametersConfig
}

export const JogStepJoint = ({
    kinematicsConfigurationIndex // , moveParams
}: JogStepJointProps) => {
    const { getUnits, toSI } = usePrefs()
    const motion = useSoloActivity(kinematicsConfigurationIndex)
    const preview = usePreview()
    const joints = useJointsForKinematicsConfiguration(kinematicsConfigurationIndex)

    // we need to memoize this to avoid use local storage doing work on every render,
    // due to change in initial value
    const jointStepsInitialValue = useMemo(() => {
        return joints.map(() => "0")
    }, [joints])

    const [steps, setSteps] = useLocalStorage("jog.joint.steps", jointStepsInitialValue)

    function jogStep(index, distance) {
        // convert to SI units
        const distance_si = toSI(
            Number(distance),
            joints[index].config.jointType === JOINT_TYPE.JOINT_PRISMATIC ? "linear" : "angular"
        )
        preview.disable()
        return (
            motion
                .moveJoints(joints.map((j, i) => (i === index ? distance_si : 0)))
                .relative()
                // .params(moveParams)
                .promise()
                .finally(preview.enable)
        )
    }

    function updateJogStep(index, e: React.ChangeEvent<HTMLInputElement>) {
        setSteps(current => current.map((v, i) => (i === index ? e.target.value : v)))
    }

    return (
        <div>
            {joints.map(({ config, index: physical_index }, logical_index) => (
                <JointSliderDiv key={logical_index}>
                    <Button onClick={() => jogStep(logical_index, -steps[logical_index])}>
                        <DoubleLeftOutlined />
                    </Button>
                    <Input
                        value={steps[logical_index]}
                        onChange={e => updateJogStep(logical_index, e)}
                        addonBefore={config.name}
                        addonAfter={getUnits(
                            config.jointType === JOINT_TYPE.JOINT_REVOLUTE ? "angular" : "linear"
                        )}
                    />
                    <Button onClick={() => jogStep(logical_index, steps[logical_index])}>
                        <DoubleRightOutlined />
                    </Button>
                </JointSliderDiv>
            ))}
        </div>
    )
}
