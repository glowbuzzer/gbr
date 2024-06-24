import React, { useContext } from "react"
import { Space, Button, Tooltip, message, Tag } from "antd"
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
    UploadOutlined,
    ReloadOutlined,
    DownloadOutlined
} from "@ant-design/icons"
import { EtherCatConfigContext } from "./EtherCatConfigContext"
import styled from "styled-components" // Adjust import based on your actual path

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end; // Aligns contents to the right horizontally
`

const IconWrapper = styled.span<{ color: string }>`
    color: ${props => props.color};
    font-size: 20px;
    vertical-align: middle;
`

const StyledButton = styled.button<{ disabled?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    height: 24px;
    background-color: ${props => (props.disabled ? "#d3d3d3" : "#b097ff")};
    border: none;
    border-radius: 4px;
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
    color: white;

    &:hover {
        background-color: ${props => (props.disabled ? "#d3d3d3" : "#8f75ff")};
    }
`

const StatusIndicator: React.FC = () => {
    const context = useContext(EtherCatConfigContext)

    if (!context) {
        throw new Error("StatusIndicator must be used within an EtherCatConfigProvider")
    }

    const {
        config,
        configEdited,
        configUploaded,
        etherCatRebooting,
        uploadConfig,
        reboot,
        downloadConfig,
        configLoaded
    } = context

    const handleUpload = () => {
        uploadConfig().catch(error => {
            message.error("Failed to upload configuration.")
        })
    }

    const handleReboot = () => {
        reboot().catch(error => {
            message.error("Failed to reboot.")
        })
    }

    const handleDownload = () => {
        downloadConfig().catch(error => {
            message.error("Failed to download configuration.")
        })
    }

    return (
        <StatusContainer>
            <Tag>
                {config?.machine_name
                    ? `${config.machine_name}_${config.sub_machine_name}`
                    : "NO MACHINE CONFIG DOWNLOADED"}
            </Tag>
            <Tooltip title="EtherCAT configuration downloaded">
                <IconWrapper color={configLoaded ? "green" : "red"}>
                    {configLoaded ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </IconWrapper>
            </Tooltip>
            <Tooltip title="EtherCAT configuration has been changed">
                <IconWrapper color={configEdited ? "green" : "red"}>
                    {configEdited ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </IconWrapper>
            </Tooltip>
            <Tooltip title="EtherCAT configuration successfully uploaded">
                <IconWrapper color={configUploaded ? "green" : "red"}>
                    {configUploaded ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </IconWrapper>
            </Tooltip>
            <Tooltip title="EtherCAT Network rebooted (needed to apply changes)">
                <IconWrapper color={etherCatRebooting ? "green" : "red"}>
                    {etherCatRebooting ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </IconWrapper>
            </Tooltip>
            <Tooltip title="Download EtherCAT config to edit">
                <StyledButton onClick={handleDownload} disabled={configLoaded}>
                    <DownloadOutlined />
                </StyledButton>
            </Tooltip>
            <Tooltip title="Upload EtherCAT config to machine">
                <StyledButton onClick={handleUpload} disabled={!configLoaded || !configEdited}>
                    <UploadOutlined />
                </StyledButton>
            </Tooltip>
            <Tooltip title="Reboot EtherCAT network (to apply changes)">
                <StyledButton
                    onClick={handleReboot}
                    // disabled={etherCatRebooting || !configLoaded || !configUploaded}
                >
                    <ReloadOutlined />
                </StyledButton>
            </Tooltip>
        </StatusContainer>
    )
}

export default StatusIndicator
