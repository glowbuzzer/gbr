/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TelemetryPVAT,
    TelemetryVisibilityOptions,
    useJointConfigurationList,
    useTelemetryControls
} from "@glowbuzzer/store"
import * as React from "react"
import { useEffect, useState } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import { Radio, Tag } from "antd"
import styled from "styled-components"
import { TelemetryChartCombined } from "./TelemetryChartCombined"
import { axis_colors } from "./update"

const StyledTelemetryForKinematicsConfiguration = styled.div`
    user-select: none;
    padding: 10px;
    height: 100%;
    margin-bottom: 4px;
    background: ${props => props.theme.colorBgContainer};
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    //background: grey;

    .controls {
        display: flex;
        gap: 5px;

        align-items: center;

        .title {
            flex-grow: 1;
            text-align: right;
        }

        .ant-tag:hover {
            outline: 1px solid grey;
        }
    }
`

const StyledAxisToggle = styled(Tag)<{ axiscolor: string; selected: boolean }>`
    cursor: pointer;

    span {
        display: block;
        min-width: 18px;
        margin-bottom: 3px;
        text-align: center;
        border-bottom: 2px solid ${props => (props.selected ? props.axiscolor : "transparent")};
    }
`
export const TelemetryForKinematicsConfiguration = ({ kinematicsConfiguration, visible }) => {
    const { plot } = useTelemetryControls()
    const joints = useJointConfigurationList()
    const [selected, setSelected] = useState(
        kinematicsConfiguration.participatingJoints.map(() => true)
    )

    useEffect(() => {
        setSelected(kinematicsConfiguration.participatingJoints.map(() => true))
    }, [kinematicsConfiguration.participatingJoints.length])

    const [desired_view, setView] = useLocalStorage(
        "viewTelemetrySetActBoth",
        TelemetryVisibilityOptions.SET
    )

    function toggle_selected(index) {
        console.log("toggle", index, selected)
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
                <TelemetryChartCombined
                    kinematicsConfiguration={kinematicsConfiguration}
                    selected={selected}
                    view={view}
                />
            )}
        </StyledTelemetryForKinematicsConfiguration>
    )
}
