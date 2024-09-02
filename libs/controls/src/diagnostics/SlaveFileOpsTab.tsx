import React, { useState, useEffect } from "react"
import { isEtherCatConfig } from "../config/etherCatConfigTab/isEtherCatConfig"
import { EtherCatConfig, exampleConfig } from "../config/etherCatConfigTab/EtherCatConfigTypes"
import { Tag, Tooltip, message, Button, Modal, Typography } from "antd"
import { GBEM_REQUEST, useConnection } from "@glowbuzzer/store"
import styled from "styled-components"
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined } from "@ant-design/icons"

const { Text } = Typography

interface SlaveSupportedFileOps {
    eepName: string
    operationName: string
    fileName: string
    password: number
}

//plant file plant_model.csv
//log file log_curr.log
//config file - (config.csv .factory_config)

const slaveSupportedFileOps: SlaveSupportedFileOps[] = [
    {
        eepName: "SOMANET",
        operationName: "Read log file",
        fileName: "logging_curr.log",
        password: 0
    },
    {
        eepName: "SOMANET",
        operationName: "Read plant model file",
        fileName: "plant_model.csv",
        password: 0
    },
    {
        eepName: "SOMANET",
        operationName: "Read config file",
        fileName: "config.csv",
        password: 0
    }
]

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

/**
 * The slave file operations tab. Slaves where file operations that .
 */
export const SlaveFileOpsTab = () => {
    const { request } = useConnection()
    const [config, setConfig] = useState<EtherCatConfig | null>(null)
    const [useDummyConfig, setUseDummyConfig] = useState(false)
    const [configLoaded, setConfigLoaded] = useState(false)
    const [slaveOperations, setSlaveOperations] = useState<
        Record<
            string,
            {
                ops: SlaveSupportedFileOps[]
                index: number
            }
        >
    >({})
    const [responseData, setResponseData] = useState<Record<string, string>>({})
    const [responseText, setResponseText] = useState("No data read")
    const [isError, setIsError] = useState(false)
    const [errorData, setErrorData] = useState<Record<string, string>>({})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalContent, setModalContent] = useState("")

    const [activeModal, setActiveModal] = useState<{
        slave: number
        slaveName: string
        file: string
    } | null>(null)

    const sendRequest = (
        filename: string,
        password: number,
        slaveIndex: number,
        slaveName: string
    ) => {
        const requestType = GBEM_REQUEST.GBEM_REQUEST_GET_FILE
        const requestText = JSON.stringify({
            payload: {
                filename,
                password,
                slave: slaveIndex
            }
        })

        console.log("Request", requestText)

        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                setIsError(false)
                const key = `${slaveIndex}-${slaveName}-${filename}` // Update the key to include slave number

                // if (response?.payload?.value) {
                //     setResponseText(response.payload.value)
                // } else {
                //     setResponseText("Unexpected response format")
                // }
                //
                // console.log("Formatted Response", response)
                if (response?.payload?.value) {
                    setResponseData(prevData => ({
                        ...prevData,
                        [key]: response.payload.value
                    }))
                    setErrorData(prevData => ({
                        ...prevData,
                        [key]: "" // Clear previous error
                    }))
                } else {
                    setResponseData(prevData => ({
                        ...prevData,
                        [key]: "Unexpected response format"
                    }))
                    setErrorData(prevData => ({
                        ...prevData,
                        [key]: "Unexpected response format"
                    }))
                }
            })
            .catch(err => {
                console.error("Error", err)
                const key = `${slaveIndex}-${slaveName}-${filename}` // Use the same key for error tracking
                setErrorData(prevData => ({
                    ...prevData,
                    [key]: `Error: ${err.message}`
                }))
                // console.log("Error data", errorData)
            })
    }

    function handleValidationFailure() {
        setConfigLoaded(false)
        message.error("Configuration validation failed. Please check the configuration format.")
    }

    const downloadConfig = async () => {
        try {
            if (useDummyConfig) {
                // Use the dummy configuration for development
                if (isEtherCatConfig(exampleConfig)) {
                    setConfig(exampleConfig)
                    setConfigLoaded(true)
                    message.success("Dummy configuration loaded successfully.")
                } else {
                    setConfigLoaded(false)
                    message.error("Dummy configuration validation failed.")
                }
            } else {
                // Fetch configuration from the server
                const response = await request("get gbem config", {})
                let parsedConfig

                try {
                    // Parse the response configuration
                    parsedConfig =
                        typeof response.config === "string"
                            ? JSON.parse(response.config)
                            : response.config

                    // Validate the parsed configuration
                    if (isEtherCatConfig(parsedConfig)) {
                        setConfig(parsedConfig)
                        setConfigLoaded(true) // Set configLoaded to true if validation succeeds
                        console.log("Config", parsedConfig)
                        message.success("Configuration loaded successfully.")
                    } else {
                        handleValidationFailure()
                    }
                } catch (parseError) {
                    console.error("Failed to parse configuration JSON:", parseError)
                    message.error("Failed to parse configuration. Please check the format.")
                }
            }
        } catch (error) {
            console.error("Failed to load EtherCAT configuration:", error)
            setConfigLoaded(false) // Set configLoaded to false in case of error
            message.error("Failed to load EtherCAT configuration. Please try again later.")
        }
    }

    const handleDownload = () => {
        downloadConfig().catch(error => {
            message.error("Failed to download configuration.")
        })
    }

    // Function to count and list slaves and their supported operations
    useEffect(() => {
        if (config) {
            const operations: Record<string, { ops: SlaveSupportedFileOps[]; index: number }> = {}
            config.ethercat.slaves.forEach((slave, index) => {
                const matchingOps = slaveSupportedFileOps.filter(
                    op => op.eepName === slave.eep_name
                )
                if (matchingOps.length > 0) {
                    operations[slave.name] = { ops: matchingOps, index }
                }
            })
            setSlaveOperations(operations)
        }
    }, [config])

    const handleModalClose = () => {
        setIsModalVisible(false)
        setActiveModal(null) // Reset the active modal content
        setModalContent("")
    }

    console.log("config", config)

    return (
        <>
            <p>
                {" "}
                First, download the configuration of EtherCAT slaves by clicking on the Download
                button on the right-hand-side.
            </p>
            <Button
                size="small"
                onClick={() => {
                    setUseDummyConfig(!useDummyConfig)
                    setConfigLoaded(false) // Reset config loaded status
                }}
                style={{ marginLeft: 8 }}
            >
                {useDummyConfig ? "Switch to Real Config" : "Switch to Dummy Config"}
            </Button>
            <StatusContainer>
                <Tooltip title="Machine name & sub-machine name">
                    <Tag>
                        {config?.machine_name
                            ? `${config.machine_name}_${config.sub_machine_name}`
                            : "NO MACHINE CONFIG DOWNLOADED"}
                    </Tag>
                </Tooltip>
                <Tooltip title="EtherCAT configuration downloaded">
                    <IconWrapper color={configLoaded ? "green" : "red"}>
                        {configLoaded ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    </IconWrapper>
                </Tooltip>
                <Tooltip title="Download EtherCAT config to edit">
                    <StyledButton onClick={handleDownload} disabled={configLoaded}>
                        <DownloadOutlined />
                    </StyledButton>
                </Tooltip>
            </StatusContainer>
            {Object.keys(slaveOperations).length > 0 && (
                <div>
                    <p>
                        Supported File Operations of the slaves on the EtherCAT network are as
                        follows:
                    </p>
                    {Object.entries(slaveOperations).map(
                        ([slaveName, { ops, index }], slaveIndex) => (
                            <div key={slaveIndex}>
                                <p>
                                    {slaveName} (Slave Number: {index}) supports:
                                </p>
                                <ul>
                                    {ops.map((op, opIndex) => (
                                        <li key={opIndex} style={{ marginBottom: 8 }}>
                                            {op.operationName} - {op.fileName} (Password:{" "}
                                            {op.password})
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    sendRequest(
                                                        op.fileName,
                                                        op.password,
                                                        index,
                                                        slaveName
                                                    )
                                                }
                                                style={{ marginLeft: 8 }}
                                            >
                                                Send Request
                                            </Button>
                                            {errorData[`${index}-${slaveName}-${op.fileName}`] && (
                                                <Tag color="red" style={{ marginLeft: 8 }}>
                                                    {
                                                        errorData[
                                                            `${index}-${slaveName}-${op.fileName}`
                                                        ]
                                                    }
                                                </Tag>
                                            )}
                                            {!errorData[`${index}-${slaveName}-${op.fileName}`] &&
                                                responseData[
                                                    `${index}-${slaveName}-${op.fileName}`
                                                ] && (
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        onClick={() =>
                                                            setActiveModal({
                                                                slave: index,
                                                                slaveName: slaveName,
                                                                file: op.fileName
                                                            })
                                                        }
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        Show Response
                                                    </Button>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            )}
            {activeModal && (
                <Modal
                    title={`File Content from ${activeModal.slaveName} (Slave Number: ${activeModal.slave}) - ${activeModal.file}`}
                    visible={true}
                    onOk={handleModalClose}
                    onCancel={handleModalClose}
                    footer={[
                        <Button key="close" onClick={handleModalClose}>
                            Close
                        </Button>
                    ]}
                >
                    <pre>
                        {
                            responseData[
                                `${activeModal.slave}-${activeModal.slaveName}-${activeModal.file}`
                            ]
                        }
                    </pre>
                </Modal>
            )}
        </>
    )
}
