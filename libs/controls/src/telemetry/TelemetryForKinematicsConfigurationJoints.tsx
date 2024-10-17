/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */

import {
    KinematicsConfigurationConfig,
    TelemetryPVAT,
    TelemetryVisibilityOptions,
    useJointConfigurationList,
    useTelemetryControls,
    WithNameAndDescription
} from "@glowbuzzer/store"
import * as React from "react"
import { useEffect, useState } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import { Radio } from "antd"
import { TelemetryChartCombinedJoints } from "./TelemetryChartCombinedJoints"
import { axis_colors } from "./update"
import { StyledAxisToggle, StyledTelemetryForKinematicsConfiguration } from "./styles"

type TelemetryForKinematicsConfigurationProps = {
    kinematicsConfiguration: WithNameAndDescription<KinematicsConfigurationConfig>
    visible: boolean
}

export const TelemetryForKinematicsConfigurationJoints = ({
    kinematicsConfiguration,
    visible
}: TelemetryForKinematicsConfigurationProps) => {
    const { plot } = useTelemetryControls()
    const joints = useJointConfigurationList()
    const [selected, setSelected] = useState<boolean[]>(
        kinematicsConfiguration.participatingJoints.map(() => true)
    )

    useEffect(() => {
        setSelected(kinematicsConfiguration.participatingJoints.map(() => true))
    }, [kinematicsConfiguration.participatingJoints.length])

    const [desired_view, setView] = useLocalStorage(
        "viewTelemetrySetActBoth",
        TelemetryVisibilityOptions.SET
    )

    function toggle_selected(index: number) {
        setSelected(selected.map((v, i) => (i === index ? !v : v)))
    }

    const view =
        plot === TelemetryPVAT.ACC
            ? TelemetryVisibilityOptions.SET
            : plot === TelemetryPVAT.CONTROL_EFFORT
            ? TelemetryVisibilityOptions.ACT
            : desired_view

    const disabled = plot === TelemetryPVAT.ACC || plot === TelemetryPVAT.CONTROL_EFFORT

    return (
        <StyledTelemetryForKinematicsConfiguration>
            <div className="controls">
                <div>
                    {kinematicsConfiguration.participatingJoints.map((joint, index) => (
                        <StyledAxisToggle
                            key={index}
                            axiscolor={axis_colors[index]}
                            selected={selected[index]}
                            onClick={() => toggle_selected(index)}
                        >
                            <span>{joints[joint].name}</span>
                        </StyledAxisToggle>
                    ))}
                </div>
                <div>
                    <Radio.Group
                        size="small"
                        value={view}
                        buttonStyle="solid"
                        onChange={e => setView(e.target.value)}
                        disabled={disabled}
                    >
                        <Radio.Button value={TelemetryVisibilityOptions.SET}>SET</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.ACT}>ACT</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.BOTH}>BOTH</Radio.Button>
                        <Radio.Button value={TelemetryVisibilityOptions.DIFF}>DIFF</Radio.Button>
                    </Radio.Group>
                </div>
                <div className="title">{kinematicsConfiguration.name}</div>
            </div>
            {visible && (
                <TelemetryChartCombinedJoints
                    kinematicsConfiguration={kinematicsConfiguration}
                    selected={selected}
                    view={view}
                />
            )}
        </StyledTelemetryForKinematicsConfiguration>
    )
}
