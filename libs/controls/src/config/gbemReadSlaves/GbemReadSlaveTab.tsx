/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Button, Flex, Space, Select, Card, Empty, Divider, Modal, Alert } from "antd"
import TextArea from "antd/es/input/TextArea"
import * as React from "react"
import { GBEM_REQUEST, useConnection } from "@glowbuzzer/store"
import { useState, useEffect, useRef } from "react"
import { SimpleObjectTree } from "./SimpleObjectTree"
import { BulbOutlined } from "@ant-design/icons"
import { Slave } from "../slavecatTypes/Slave"
import { SimpleObject } from "../slavecatTypes/SimpleObject"
import { DataNode } from "./transformToTreeData"
import { useSlaveCat } from "../slaveCatData/slaveCatContext"
import { DefaultValue } from "../slavecatTypes/DefaultValue"

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

const enabledSlaves: slaveList[] = [
    { idx: 1, name: "SCU-1-EC" },
    { idx: 2, name: "EK1100" },
    { idx: 3, name: "EL6021" },
    { idx: 4, name: "SYNAPTICON" }
]

interface SlaveDropdownProps {
    slaveList: slaveList[]
    slaveData: Slave[]
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
    const [selectedSlaveData, setSelectedSlaveData] = useState<Slave | undefined>(undefined)

    useEffect(() => {
        if (selectedSlave) {
            const foundSlaveData = slaveData.find(s => s.name.toUpperCase() === selectedSlave.name)
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

export const GbemReadSlaveTab = () => {
    const { request } = useConnection()
    const requestType = GBEM_REQUEST.GBEM_REQUEST_SDO_READ
    const [requestText, setRequestText] = useState(
        '{"payload": {"index": 0x1000, "subindex": 0, "length": 2}}'
    )
    const [responseText, setResponseText] = useState("")
    const [selectedNode, setSelectedNode] = useState<DataNode | null>(null)
    const [isError, setIsError] = useState(false)
    const [selectedSlave, setSelectedSlave] = useState<slaveList | undefined>(undefined)

    // State to control modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false)

    // Functions to handle modal
    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const handleNodeSelect = (node: DataNode) => {
        setSelectedNode(node)
        setResponseText(undefined)
        console.log("Selected node", node)
    }

    const slaveData = useSlaveCat() // Use the context

    const nodeSelectRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (selectedNode) {
            // Construct the request text based on the selected node
            const constructedRequestText = JSON.stringify({
                payload: {
                    slave: selectedSlave.idx, // Add the slave idx here
                    index: selectedNode.index,
                    subindex: selectedNode.subIndex || 0,
                    datatype: selectedNode.dataTypeCode,
                    length: selectedNode.bitSize ? selectedNode.bitSize / 8 : 2
                }
            })
            setRequestText(constructedRequestText)
        }
    }, [selectedNode])

    function send_request() {
        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                // if (response?.response?.error) {
                //     setIsError(true)
                //     setResponseText(response.response.message)
                // } else {
                setIsError(false)
                setResponseText(`${response.payload.value}`)
                // }

                // console.log("Response", response)
                // setResponseText(JSON.stringify(response, null, 2))
            })
            .catch(err => {
                console.error("Error", err)
                setIsError(true)
                setResponseText(err)
            })
    }

    const showDescriptionButton = selectedNode?.description ? (
        <Button
            size="small"
            type="text"
            icon={<BulbOutlined />}
            onClick={showModal}
            title="Show extra documentation about the object"
        />
    ) : null

    const selectedSlaveData = slaveData.find(
        s => selectedSlave && s.name.toUpperCase() === selectedSlave.name
    )

    if (selectedNode) {
        console.log("Selected node", selectedNode)
    }

    return (
        <StyledFlex>
            <Space>
                Selected slave{" "}
                <SlaveDropdown
                    slaveList={enabledSlaves}
                    slaveData={slaveData}
                    selectedSlave={selectedSlave}
                    setSelectedSlave={setSelectedSlave}
                />
            </Space>
            <div ref={nodeSelectRef}>
                {selectedSlaveData && selectedSlaveData.slaveInfo?.simpleSlaveObjects ? (
                    <CardsContainer>
                        <Card size={"small"} title="Object Dictionary" className="ant-card">
                            <ScrollableTreeContainer>
                                {selectedSlaveData.slaveInfo.simpleSlaveObjects &&
                                selectedSlaveData.slaveInfo.simpleSlaveObjects.length > 0 ? (
                                    <SimpleObjectTree
                                        data={selectedSlaveData.slaveInfo.simpleSlaveObjects}
                                        onSelect={handleNodeSelect}
                                    />
                                ) : (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="No data in object dictionary"
                                        imageStyle={{ height: 60 }}
                                    />
                                )}
                            </ScrollableTreeContainer>
                        </Card>

                        {selectedNode && (
                            <Card
                                size={"small"}
                                title={`Selected Object: ${selectedNode.name}`}
                                className="second-card"
                                extra={showDescriptionButton} // Added extra prop
                                // style={{ overflow: "auto", width: "350px" }}
                            >
                                {/*<StyledDivider orientation="left">Object Details</StyledDivider>*/}

                                <StyledCardParagraph>
                                    <strong>Name: </strong>
                                    {selectedNode.name}
                                </StyledCardParagraph>

                                <StyledCardParagraph>
                                    <strong>Index:</strong> 16#
                                    {selectedNode.index.toString(16).toUpperCase()}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>SubIndex:</strong> {selectedNode.subIndex}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Default Value:</strong> {selectedNode.defaultValue}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Min:</strong> {selectedNode.min || "No min"}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Max:</strong> {selectedNode.max || "No max"}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Unit:</strong> {selectedNode.unit || "No unit"}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Flags:</strong> {selectedNode.flags || "No flags"}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Data Type:</strong> {selectedNode.dataType}
                                </StyledCardParagraph>
                                <StyledCardParagraph>
                                    <strong>Bit Size:</strong> {selectedNode.bitSize}
                                    {/* Modal for showing description */}
                                    <Modal
                                        title="Object Description"
                                        open={isModalVisible}
                                        onCancel={handleCancel}
                                        style={{ top: 20, left: 500 }} // Adjust this to control position
                                        footer={null}
                                        className="custom-modal" // Add a unique class here
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: selectedNode.description || ""
                                            }}
                                        />
                                    </Modal>
                                </StyledCardParagraph>
                            </Card>
                        )}
                    </CardsContainer>
                ) : (
                    <>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No data"
                            imageStyle={{ height: 60 }}
                        />
                    </>
                )}
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
                        <Button disabled={!selectedNode} size="small" onClick={send_request}>
                            Read object from slave
                        </Button>
                    </Space>
                </div>
            </div>
            {/*<TextArea rows={1} value={requestText} onChange={e => setRequestText(e.target.value)} />*/}
            {responseText && (
                <Alert
                    message={isError ? "Error reading from slave" : "Success reading from slave"}
                    description={`Value read: ${responseText}`}
                    type={isError ? "error" : "success"}
                    showIcon
                />
            )}
            {/*<div className="response">{responseText}</div>*/}
        </StyledFlex>
    )
}
