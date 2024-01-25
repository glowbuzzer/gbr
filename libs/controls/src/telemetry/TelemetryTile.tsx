/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Button, Radio, RadioChangeEvent, Slider, Space, Tag } from "antd"
import {
    CaptureState,
    JOINT_TYPE,
    TelemetryPVAT,
    useJointConfigurationList,
    useKinematicsConfigurationList,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { TelemetryForKinematicsConfiguration } from "./TelemetryForKinematicsConfiguration"
import { generate_telemetry_download } from "./download"

const StyledTelemetryGroup = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    //background: green;
`

const StyledCaptureState = styled.span`
    display: inline-block;
    color: grey;
    user-select: none;
`

const StyledDuration = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
    color: ${props => props.theme.colorText};

    .ant-slider {
        width: 150px;
    }
`

/**
 * @ignore
 */
export const TelemetryTile = () => {
    const kinematicsConfigurations = useKinematicsConfigurationList()
    const capture = useTelemetryControls()
    const { data } = useTelemetryData()
    const joints = useJointConfigurationList()
    const [isVisible, setIsVisible] = useState(!document.hidden)

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden)
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [])

    function update_pvat(e: RadioChangeEvent) {
        capture.setPlot(e.target.value)
    }

    function download() {
        generate_telemetry_download(joints, data)
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <DockToolbarButtonGroup>
                        <Radio.Group
                            size="small"
                            value={capture.plot}
                            buttonStyle="solid"
                            onChange={update_pvat}
                        >
                            <Radio.Button value={TelemetryPVAT.POS}>Pos</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.VEL}>Vel</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.ACC}>Acc</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.TORQUE}>Torque</Radio.Button>
                            <Radio.Button value={TelemetryPVAT.CONTROL_EFFORT}>
                                Control Effort
                            </Radio.Button>
                        </Radio.Group>
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        {
                            {
                                [CaptureState.RUNNING]: (
                                    <Button size="small" onClick={() => capture.pause()}>
                                        Pause
                                    </Button>
                                ),
                                [CaptureState.PAUSED]: (
                                    <Space>
                                        <Button size="small" onClick={() => capture.resume()}>
                                            Start
                                        </Button>
                                        <Button size="small" onClick={() => capture.startCapture()}>
                                            Capture
                                        </Button>
                                    </Space>
                                ),
                                [CaptureState.WAITING]: (
                                    <Button size="small" onClick={() => capture.cancelCapture()}>
                                        Cancel Capture
                                    </Button>
                                ),
                                [CaptureState.COMPLETE]: (
                                    <Space>
                                        <Button size="small" onClick={download}>
                                            Download
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => capture.cancelCapture()}
                                        >
                                            Reset
                                        </Button>
                                    </Space>
                                )
                            }[capture.captureState]
                        }
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        <StyledDuration>
                            <Slider
                                value={capture.captureDuration}
                                onChange={capture.setDuration}
                                min={250}
                                max={3000}
                                step={250}
                                tooltip={{ placement: "bottom" }}
                            />
                            <span>{capture.captureDuration} samples</span>
                        </StyledDuration>
                    </DockToolbarButtonGroup>
                    <Space>
                        <StyledCaptureState>
                            {CaptureState[capture.captureState]}
                        </StyledCaptureState>
                        {capture.lastCapture ? null : <Tag color="red">NO DATA</Tag>}
                    </Space>
                </>
            }
        >
            <StyledTelemetryGroup>
                {kinematicsConfigurations.map((kinematicsConfiguration, index) => (
                    <TelemetryForKinematicsConfiguration
                        key={index}
                        kinematicsConfiguration={kinematicsConfiguration}
                        visible={isVisible}
                    />
                ))}
            </StyledTelemetryGroup>
        </DockTileWithToolbar>
    )
}
