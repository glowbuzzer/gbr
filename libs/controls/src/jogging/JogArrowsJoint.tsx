/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    JOINT_TYPE,
    JointConfig,
    LIMITPROFILE,
    MoveParametersConfig,
    useJoint,
    useJointConfig,
    useKinematicsConfigurationList,
    usePrefs,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import styled from "styled-components"
import { MathUtils } from "three"
import { Button, Input, Slider } from "antd"
import { JogDirection, JogMode } from "./types"
import {
    ArrowLeftOutlined,
    ArrowRightOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined
} from "@ant-design/icons"
import { useLocalStorage } from "../util/LocalStorageHook"
import { useMemo } from "react"

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
            value={joint?.actPos}
            tooltip={{ open: false }}
        />
    )
}

const JogArrowsJointContinuous = ({ joints, kinematicsConfigurationIndex, moveParams }) => {
    const preview = usePreview()
    const motion = useSoloActivity(kinematicsConfigurationIndex)

    function startJog(index, direction: JogDirection) {
        const velos = joints.map(({ config }, logical_index) => {
            const vmax =
                config.limits[LIMITPROFILE.LIMITPROFILE_JOGGING]?.vmax ||
                config.limits[LIMITPROFILE.LIMITPROFILE_DEFAULT].vmax

            return logical_index === index
                ? direction === JogDirection.POSITIVE
                    ? vmax
                    : -vmax
                : 0
        })
        preview.disable()
        return motion
            .moveJointsAtVelocity(velos)
            .params(moveParams)
            .promise()
            .finally(preview.enable)
    }

    function stopJog() {
        return motion.cancel().promise()
    }

    function JogButton({ index, direction, children }) {
        return (
            <Button onMouseDown={() => startJog(index, direction)} onMouseUp={() => stopJog()}>
                {children}
            </Button>
        )
    }

    return (
        <>
            {joints.map(({ config, index: physical_index }, logical_index) => (
                <JointSliderDiv key={logical_index}>
                    <JogButton index={logical_index} direction={JogDirection.NEGATIVE}>
                        <ArrowLeftOutlined />
                    </JogButton>
                    <JointSliderReadonly jc={config} index={physical_index} />
                    <JogButton index={logical_index} direction={JogDirection.POSITIVE}>
                        <ArrowRightOutlined />
                    </JogButton>
                </JointSliderDiv>
            ))}
        </>
    )
}

type JogArrowsJointStepProps = {
    joints: { index: number; config: JointConfig & { name: string } }[]
    kinematicsConfigurationIndex: number
    moveParams: MoveParametersConfig
}

const JogArrowsJointStep = ({
    joints,
    kinematicsConfigurationIndex,
    moveParams
}: JogArrowsJointStepProps) => {
    const { getUnits, toSI } = usePrefs()
    const motion = useSoloActivity(kinematicsConfigurationIndex)
    const preview = usePreview()

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
        return motion
            .moveJoints(joints.map((j, i) => (i === index ? distance_si : 0)))
            .relative()
            .params(moveParams)
            .promise()
            .finally(preview.enable)
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

type JogArrowsJointProps = {
    jogMode: JogMode
    kinematicsConfigurationIndex: number
    jogSpeed: number
}

/** @ignore - internal to the jog tile */
export const JogArrowsJoint = ({
    jogMode,
    kinematicsConfigurationIndex,
    jogSpeed
}: JogArrowsJointProps) => {
    const kcs = useKinematicsConfigurationList()

    const kcConfig = kcs[kinematicsConfigurationIndex] || kcs[0]

    const joint_config = useJointConfig()
    const joints = kcConfig.participatingJoints.map(jointNum => ({
        index: jointNum,
        config: joint_config[jointNum]
    }))

    const moveParams: MoveParametersConfig = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed,
        limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_JOGGING
    }

    return jogMode === JogMode.CONTINUOUS ? (
        <JogArrowsJointContinuous
            joints={joints}
            moveParams={moveParams}
            kinematicsConfigurationIndex={kinematicsConfigurationIndex}
        />
    ) : (
        <JogArrowsJointStep
            joints={joints}
            moveParams={moveParams}
            kinematicsConfigurationIndex={kinematicsConfigurationIndex}
        />
    )
}
