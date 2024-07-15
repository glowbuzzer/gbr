/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Button, Flex, Space, Select, Card, Empty, Divider, Modal, Alert } from "antd"
import TextArea from "antd/es/input/TextArea"
import * as React from "react"
import { GBEM_REQUEST, useConnection } from "@glowbuzzer/store"
import { useState, useEffect, useRef } from "react"
import { SimpleObjectTree } from "../slaveCatTree/SimpleObjectTree"
import { BulbOutlined } from "@ant-design/icons"
import { SimpleObject } from "../slavecatTypes/SimpleObject"
import { DataNode } from "../slaveCatTree/transformToTreeData"
import { useSlaveCat } from "../slaveCatData/slaveCatContext"
import { DefaultValue } from "../slavecatTypes/DefaultValue"
import { EtherCatConfig, Slave } from "../EtherCatConfigTypes"
import { slaveInfo } from "../slavecatTypes/SlaveInfo"
import { SlaveCatTree } from "../slaveCatTree/SlaveCatTree"
import { useEtherCatConfig } from "../EtherCatConfigContext"
import { EventDataNode } from "antd/es/tree"
import { slave } from "../slavecatTypes/Slave"
import { ConditionalDisplayInOpEnabled } from "../../util/ConditionalDisplayInOpEnabled"

const ScrollableTreeContainer = styled.div`
    max-height: 220px; /* Adjust the height as needed */
    flex: 1;
    overflow-y: auto;
    //border: 1px solid #ccc;
    margin: 10px;
`

const StyledDivider = styled(Divider)`
    .ant-divider-inner-text {
        font-size: 14px; /* Adjust font size as needed */
    }
`

const StyledFlex = styled(Flex)`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: flex-start;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }

    .response {
        font-family: monospace;
        white-space: pre;
        overflow: auto;
        flex-grow: 0.2;
        background: ${props => props.theme.colorBgElevated};
        border-radius: 10px;
        padding: 10px;
    }
`

const DeviceInfo = styled.div`
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;

    img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
    }
`

const StyledCardParagraph = styled.p`
    margin: 4px 0;
    line-height: 1.2;
`
const CardsContainer = styled.div`
    height: 100%;
    display: flex;
    gap: 10px; /* Adjust gap between cards */

    > .ant-card {
        flex: 1; /* Ensure cards are the same size */
        display: flex;
        flex-direction: column;

        .ant-card-body {
            flex: 1; /* Ensure the card body takes up all available space */
            display: flex;
            flex-direction: column;
        }
    }

    /* Additional styles for the second card */

    > .second-card .ant-card-body {
        //max-height: 345px; /* Set the maximum height for the second card */
        overflow-y: auto; /* Make the content scrollable if it exceeds the max height */
    }
`

type slaveList = {
    idx: number
    name: string
    eep_name: string
}

// const enabledSlaves: slaveList[] = [
//     { idx: 1, name: "EL1008" },
//     { idx: 2, name: "SYNAPTICON" },
//     { idx: 3, name: "SYNAPTICON" },
//     { idx: 4, name: "EL2008" },
//     { idx: 5, name: "EL2535" },
//     { idx: 6, name: "ELM7231-9018" },
//     { idx: 7, name: "EL6021" },
//     { idx: 8, name: "EK1100" },
//     { idx: 9, name: "EK1110" }
// ]

// const enabledSlaves: slaveList[] = [
//     { idx: 1, name: "SCU-1-EC" },
//     { idx: 2, name: "EK1100" },
//     { idx: 3, name: "EL6021" },
//     { idx: 4, name: "SYNAPTICON" }
// ]

interface SlaveDropdownProps {
    slaveList: slaveList[]
    slaveData: slave[]
    selectedSlave: slaveList | undefined
    setSelectedSlave: React.Dispatch<React.SetStateAction<slaveList | undefined>>
}

// Create the styled component
const StyledSelect = styled(Select)`
    width: 200px; // Adjust width as needed
    vertical-align: middle;
`

// Function to convert binary data to base64
export const binaryToBase64 = (binary: string) => {
    let binaryString = ""
    for (let i = 0; i < binary.length; i += 2) {
        binaryString += String.fromCharCode(parseInt(binary.substr(i, 2), 16))
    }
    return btoa(binaryString)
}

const SlaveDropdown: React.FC<SlaveDropdownProps> = ({
    slaveList,
    slaveData,
    selectedSlave,
    setSelectedSlave
}) => {
    // const [selectedSlave, setSelectedSlave] = useState<slaveList | undefined>(undefined)
    // const [selectedSlaveData, setSelectedSlaveData] = useState<Slave | undefined>(undefined)
    const [selectedSlaveData, setSelectedSlaveData] = useState<slave | undefined>(undefined)

    useEffect(() => {
        if (selectedSlave) {
            console.log("Selected slave", selectedSlave)
            const foundSlaveData = slaveData.find(s => s.name === selectedSlave.eep_name)
            setSelectedSlaveData(foundSlaveData)
            console.log("Selected slave data", foundSlaveData)
        } else {
            setSelectedSlaveData(undefined)
        }
    }, [selectedSlave])

    const handleChange = (value: number) => {
        const selected = slaveList.find(slave => slave.idx === value)
        setSelectedSlave(selected)
    }

    const base64Image = selectedSlaveData?.slaveInfo?.image
        ? binaryToBase64(selectedSlaveData.slaveInfo.image.replace(/\s/g, ""))
        : ""

    const imageUrl = base64Image ? `data:image/bmp;base64,${base64Image}` : ""

    return (
        <div>
            <StyledSelect
                placeholder="Select a slave"
                onChange={handleChange}
                value={selectedSlave?.idx}
            >
                {slaveList.map(slave => (
                    <Select.Option key={slave.idx} value={slave.idx}>
                        {`[${slave.idx}] ${slave.name}`}
                    </Select.Option>
                ))}
            </StyledSelect>
            {selectedSlaveData ? (
                <DeviceInfo>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Vendor Logo"
                            style={{ marginLeft: "5px", width: "16px", height: "14px" }}
                        />
                    )}
                    <span>{`${selectedSlaveData.slaveInfo.deviceName} (${selectedSlaveData.slaveInfo.vendor})`}</span>
                </DeviceInfo>
            ) : (
                <span style={{ marginLeft: 10 }}>Select a slave to view object dictionary</span>
            )}
        </div>
    )
}

//filter slave list by optional
function transformToSlaveList(config: EtherCatConfig): slaveList[] {
    return config.ethercat.slaves
        .map((slave, index) => ({
            idx: index,
            name: slave.name,
            eep_name: slave.eep_name,
            is_configurable: slave.optional.is_configurable,
            is_enabled: slave.optional.is_enabled
        }))
        .filter(slave => !(slave.is_configurable && !slave.is_enabled))
        .map(({ idx, name, eep_name }) => ({ idx, name, eep_name }))
}

type EtherCatReadSlaveTabProps = {}

// interface ResponsePayload {
//     payload: {
//         value: number
//     }
// }

interface SuccessResponsePayload {
    payload: {
        value: number
    }
}

// interface FailureResponsePayload {
//     requestId: string
//     error: true
//     requestType: number
//     message: string
// }

type ResponsePayload = SuccessResponsePayload

export const EtherCatReadSlaveTab: React.FC<EtherCatReadSlaveTabProps> = ({}) => {
    const { request } = useConnection()

    const {
        config,
        setConfig,
        setEditedConfig,
        editedConfig,
        configLoaded,
        setConfigLoaded,
        configEdited,
        setConfigEdited
    } = useEtherCatConfig()

    const requestType = GBEM_REQUEST.GBEM_REQUEST_SDO_READ
    const [requestText, setRequestText] = useState(
        '{"payload": {"index": 0x1000, "subindex": 0, "length": 2}}'
    )
    const [responseText, setResponseText] = useState<string>("")
    const [selectedNode, setSelectedNode] = useState<DataNode | null>(null)
    const [isError, setIsError] = useState(false)
    const [selectedSlave, setSelectedSlave] = useState<slaveList | undefined>(undefined)
    const [selectedSlaveData, setSelectedSlaveData] = useState<slave | undefined>(undefined)

    const filteredSlaveList = transformToSlaveList(config)
    console.log(filteredSlaveList) // Output: [ { idx: 0, name: 'Eep1' } ]

    // const handleNodeSelect = (node: DataNode) => {
    //     setSelectedNode(node)
    //     setResponseText(undefined)
    //     console.log("Selected node", node)
    // }

    const slaveData = useSlaveCat() // Use the context

    const nodeSelectRef = useRef<HTMLDivElement | null>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // const getPayloadValue = (response: string): number | string => {
    //     try {
    //         const parsedResponse: ResponsePayload = JSON.parse(response)
    //         return parsedResponse.payload.value
    //     } catch (error) {
    //         return "Invalid response format"
    //     }
    // }

    const getPayloadValue = (response: string): number | string => {
        console.log("Response", response)
        try {
            const parsedResponse: ResponsePayload = JSON.parse(response)
            console.log("Parsed response", parsedResponse)
            if (parsedResponse.payload.value !== undefined) {
                return parsedResponse.payload.value
            } else {
                return "Invalid response format"
            }
        } catch (error) {
            return "Invalid response format"
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isScrolling) return // Ignore clicks if scrolling

            const node = nodeSelectRef.current
            const modal = document.querySelector(".custom-modal")

            if (
                node &&
                !node.contains(event.target as Node) &&
                (!modal || !modal.contains(event.target as Node))
            ) {
                setSelectedNode(null)
                setResponseText(undefined)
                console.log("Clicked outside")
            }
        }

        const handleScroll = () => {
            console.log("scrolling")
            setIsScrolling(true)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false)
            }, 200) // Adjust timeout as needed
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("scroll", handleScroll, true) // true to capture the event

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("scroll", handleScroll, true)
        }
    }, [isScrolling])

    useEffect(() => {
        if (selectedNode) {
            const constructedRequestText = JSON.stringify({
                payload: {
                    slave: selectedSlave?.idx,
                    index: selectedNode.index,
                    subindex: selectedNode.subIndex || 0,
                    datatype: selectedNode.dataTypeCode,
                    length: selectedNode.bitSize ? selectedNode.bitSize / 8 : 2
                }
            })
            setRequestText(constructedRequestText)
        }
    }, [selectedNode])

    useEffect(() => {
        if (selectedNode) {
            // Construct the request text based on the selected node
            const constructedRequestText = JSON.stringify({
                payload: {
                    slave: selectedSlave.idx + 1, // Add the slave idx here
                    index: selectedNode.index,
                    subindex: selectedNode.subIndex || 0,
                    datatype: selectedNode.dataTypeCode,
                    length: selectedNode.bitSize ? selectedNode.bitSize / 8 : 2
                }
            })
            setRequestText(constructedRequestText)
        }
    }, [selectedNode])

    // function send_request() {
    //     request(requestType, JSON.parse(requestText))
    //         .then(response => {
    //             console.log("Response", response)
    //             // if (response?.response?.error) {
    //             //     setIsError(true)
    //             //     setResponseText(response.response.message)
    //             // } else {
    //             setIsError(false)
    //             setResponseText(`${response.payload.value}`)
    //             // }
    //
    //             // console.log("Response", response)
    //             setResponseText(JSON.stringify(response, null, 2))
    //         })
    //         .catch(err => {
    //             console.error("Error", err)
    //             setIsError(true)
    //             setResponseText(err)
    //         })
    // }
    function send_request() {
        setIsError(false)
        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                try {
                    // Directly set the raw response text for further processing
                    setResponseText(JSON.stringify(response))
                } catch (error) {
                    console.error("Parsing Error", error)
                    setIsError(true)
                    setResponseText("Invalid response format")
                }
            })
            .catch(err => {
                console.error("Request Error", err)
                setIsError(true)
                setResponseText(err.toString())
            })
    }

    // const showDescriptionButton = selectedNode?.description ? (
    //     <Button
    //         size="small"
    //         type="text"
    //         icon={<BulbOutlined />}
    //         onClick={showModal}
    //         title="Show extra documentation about the object"
    //     />
    // ) : null

    // const selectedSlaveData = slaveData.find(
    //     s => selectedSlave && s.name.toUpperCase() === selectedSlave.name
    // )

    useEffect(() => {
        if (selectedSlave) {
            console.log("Selected slave", selectedSlave)
            const foundSlaveData = slaveData.find(s => s.name === selectedSlave.eep_name)
            setSelectedSlaveData(foundSlaveData)
            console.log("Selected slave data", foundSlaveData)
        } else {
            setSelectedSlaveData(undefined)
        }
    }, [selectedSlave, slaveData]) // Add slaveData to dependency array

    if (selectedNode) {
        console.log("Selected node", selectedNode)
    }

    const handleNodeSelect = (node: DataNode) => {
        setSelectedNode(node)
        setResponseText(undefined)
        console.log("Selected node", node)
    }

    return (
        <ConditionalDisplayInOpEnabled>
            <StyledFlex>
                <Space>
                    Selected slave{" "}
                    <SlaveDropdown
                        slaveList={filteredSlaveList}
                        slaveData={slaveData}
                        selectedSlave={selectedSlave}
                        setSelectedSlave={setSelectedSlave}
                    />
                </Space>
                <div>
                    <SlaveCatTree
                        slaveData={selectedSlaveData}
                        // onNodeSelect={setSelectedNode}
                        selectedNode={selectedNode}
                        onNodeSelect={handleNodeSelect}
                    />
                    <div>
                        <Space style={{ marginTop: 10 }}>
                            {selectedNode ? (
                                <span style={{ marginRight: 10 }}>
                                    You have selected an object, now read the value from the slave
                                </span>
                            ) : (
                                <span style={{ marginRight: 10 }}>
                                    Select an object before reading from slave
                                </span>
                            )}
                            <Button
                                disabled={!selectedNode || selectedNode.isParent}
                                size="small"
                                onClick={send_request}
                            >
                                Read object from slave
                            </Button>
                        </Space>
                    </div>
                </div>
                {responseText && (
                    <Alert
                        message={
                            isError ? "Error reading from slave" : "Success reading from slave"
                        }
                        description={
                            isError
                                ? `${responseText}`
                                : `Value read: ${getPayloadValue(responseText)}`
                        }
                        type={isError ? "error" : "success"}
                        showIcon
                    />
                )}
            </StyledFlex>
        </ConditionalDisplayInOpEnabled>
    )
}
