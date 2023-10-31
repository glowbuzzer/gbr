/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useJointConfigurationList } from "@glowbuzzer/store"
import * as React from "react"
import { useState } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import { axis_colors, SparklineJoints, TelemetryVisibilityOptions } from "./SparklineJoints"
import { Radio, Tag } from "antd"
import styled from "styled-components"
import { Sparkline2 } from "./Sparkline2"

const StyledTelemetryForKinematicsConfiguration = styled.div`
    user-select: none;
    padding: 10px;
    height: 100%;
    margin-bottom: 4px;
    background: ${props => props.theme.colorBgContainer};
    display: flex;
    flex-direction: column;

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

    .chart {
        flex-grow: 1;
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
export const TelemetryForKinematicsConfiguration = ({
    kinematicsConfiguration,
    duration,
    visible
}) => {
    const joints = useJointConfigurationList()
    const [selected, setSelected] = useState(
        kinematicsConfiguration.participatingJoints.map(() => true)
    )

    const [view, setView] = useLocalStorage(
        "viewTelemetrySetActBoth",
        TelemetryVisibilityOptions.SET
    )

    function toggle_selected(index) {
        setSelected(selected.map((v, i) => (i === index ? !v : v)))
    }

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
                <Sparkline2
                    kinematicsConfiguration={kinematicsConfiguration}
                    selected={selected}
                    view={view}
                />
                /*
                <SparklineJoints
                    kinematicsConfiguration={kinematicsConfiguration}
                    selected={selected}
                    view={view}
                    duration={duration}
                />
*/
            )}
        </StyledTelemetryForKinematicsConfiguration>
    )
}
