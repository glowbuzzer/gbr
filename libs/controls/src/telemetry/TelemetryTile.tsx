/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Button, Radio, RadioChangeEvent, Slider, Space, Tag, Upload } from "antd"
import {
    CaptureState,
    TelemetryPVAT,
    telemetrySlice,
    useJointConfigurationList,
    useKinematicsConfigurationList,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { DockToolbarButtonGroup } from "../dock"
import { TelemetryForKinematicsConfigurationJoints } from "./TelemetryForKinematicsConfigurationJoints"
import { generate_telemetry_download, parse_telemetry_csv } from "./download"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { CloudDownloadOutlined, FolderOpenOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"
import { XyIcon } from "../icons/XyIcon"
import { TelemetryForKinematicsConfigurationCartesian } from "./TelemetryForKinematicsConfigurationCartesian"

const StyledTelemetryGroup = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    //background: green;
`

const StyledCaptureState = styled(Tag)`
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
        width: 100px;
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
    const dispatch = useDispatch()

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

    function before_upload(info) {
        info.arrayBuffer().then((buffer: ArrayBuffer) => {
            const csv = new TextDecoder("utf-8").decode(buffer)
            const data = parse_telemetry_csv(csv)
            dispatch(telemetrySlice.actions.restore(data))
        })
        return false
    }

    function download() {
        generate_telemetry_download(joints, data)
    }

    const can_download_upload =
        capture.captureState === CaptureState.COMPLETE ||
        capture.captureState === CaptureState.PAUSED

    const { showXyz } = capture

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <DockToolbarButtonGroup>
                        <GlowbuzzerIcon
                            useFill={true}
                            Icon={XyIcon}
                            button
                            title={showXyz ? "Show Joints" : "Show XYZ"}
                            checked={showXyz}
                            onClick={() => capture.setShowXyz(!showXyz)}
                        />
                    </DockToolbarButtonGroup>
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
                                    <Button size="small" onClick={() => capture.cancelCapture()}>
                                        Reset
                                    </Button>
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
                    <DockToolbarButtonGroup>
                        <Space>
                            <GlowbuzzerIcon
                                useFill
                                Icon={CloudDownloadOutlined}
                                onClick={download}
                                button
                                title="Download Telemetry to File"
                                disabled={!can_download_upload}
                            />
                            <Upload
                                beforeUpload={before_upload}
                                maxCount={1}
                                showUploadList={false}
                                disabled={!can_download_upload}
                            >
                                <GlowbuzzerIcon
                                    useFill={true}
                                    Icon={FolderOpenOutlined}
                                    button
                                    title="Load Telemetry from File"
                                    disabled={!can_download_upload}
                                />
                            </Upload>
                        </Space>
                    </DockToolbarButtonGroup>
                    <Space>
                        <StyledCaptureState>
                            {CaptureState[capture.captureState]}
                        </StyledCaptureState>
                        {capture.enabled ? null : <Tag color="red">NO DATA</Tag>}
                    </Space>
                </>
            }
        >
            <StyledTelemetryGroup>
                {kinematicsConfigurations.map((kinematicsConfiguration, index) =>
                    showXyz ? (
                        <TelemetryForKinematicsConfigurationCartesian
                            key={index}
                            title={kinematicsConfiguration.name}
                            kinematicsConfigurationIndex={index}
                            visible={isVisible}
                        />
                    ) : (
                        <TelemetryForKinematicsConfigurationJoints
                            key={index}
                            kinematicsConfiguration={kinematicsConfiguration}
                            visible={isVisible}
                        />
                    )
                )}
            </StyledTelemetryGroup>
        </DockTileWithToolbar>
    )
}
