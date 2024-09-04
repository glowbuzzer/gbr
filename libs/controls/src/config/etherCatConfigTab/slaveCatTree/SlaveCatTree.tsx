import React, { useEffect, useState, ReactNode } from "react"
import styled from "styled-components"
import { Button, Card, Empty, Modal } from "antd"
import { SimpleObjectTree } from "./SimpleObjectTree"
import { DataNode } from "./transformToTreeData"
import { Slave } from "../EtherCatConfigTypes"

import { slave } from "../slavecatTypes/Slave"

// Define types for props
interface SlaveObjectTreeProps {
    slaveData: slave | undefined
    onNodeSelect: (node: DataNode) => void
    selectedNode: DataNode | null
}

// Styled components for the tree container
const ScrollableTreeContainer = styled.div`
    //max-height: 220px;
    flex: 1;
    overflow-y: auto;
    margin: 10px;
`

const CardsContainer = styled.div`
    height: 100%;
    display: flex;
    gap: 10px;

    > .ant-card {
        max-height: 220px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Ensure the card content does not overflow the card */

        .ant-card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden; /* Ensure the card content does not overflow the card */
            word-wrap: break-word; /* Wrap long words */
            word-break: break-word; /* Ensure long words break */
        }
    }

    > .second-card .ant-card-body {
        max-height: 220px;
        overflow-y: auto;
        //max-height: 262px;
    }
`

export const SlaveCatTree: React.FC<SlaveObjectTreeProps> = ({
    slaveData,
    onNodeSelect,
    selectedNode
}) => {
    // State to control modal visibility
    // State to control modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false)

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    // Handle button click to show modal
    const handleShowModal = () => {
        setIsModalVisible(true)
    }

    // console.log(slaveData)

    return (
        <div>
            {slaveData && slaveData.slaveInfo?.simpleSlaveObjects ? (
                <CardsContainer>
                    <Card size={"small"} title="Object Dictionary" className="ant-card">
                        <ScrollableTreeContainer>
                            {slaveData.slaveInfo.simpleSlaveObjects.length > 0 ? (
                                <SimpleObjectTree
                                    data={slaveData.slaveInfo.simpleSlaveObjects}
                                    onSelect={onNodeSelect}
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
                    {selectedNode &&
                        (!selectedNode.isParent ? (
                            <Card
                                size={"small"}
                                title={`Selected Object: ${selectedNode.name}`}
                                className="second-card"
                            >
                                <p>
                                    <strong>Name: </strong>
                                    {selectedNode.name}
                                </p>
                                <p>
                                    <strong>Index:</strong> 16#
                                    {selectedNode.index.toString(16).toUpperCase()}
                                </p>
                                <p>
                                    <strong>SubIndex:</strong> {selectedNode.subIndex}
                                </p>
                                <p>
                                    <strong>Default Value:</strong> {selectedNode.defaultValue}
                                </p>
                                <p>
                                    <strong>Min:</strong> {selectedNode.min || "No min"}
                                </p>
                                <p>
                                    <strong>Max:</strong> {selectedNode.max || "No max"}
                                </p>
                                <p>
                                    <strong>Unit:</strong> {selectedNode.unit || "No unit"}
                                </p>
                                <p>
                                    <strong>Flags:</strong> {selectedNode.flags || "No flags"}
                                </p>
                                <p>
                                    <strong>Data Type:</strong> {selectedNode.dataType}
                                </p>
                                <p>
                                    <strong>Bit Size:</strong> {selectedNode.bitSize}
                                </p>

                                {/* Show the button if description exists */}
                                {selectedNode.description && (
                                    <Button type="primary" onClick={handleShowModal}>
                                        Show Description
                                    </Button>
                                )}
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
                            </Card>
                        ) : (
                            <Card
                                size={"small"}
                                title={`Selected Object: ${selectedNode.name}`}
                                className="second-card"
                            >
                                <p>
                                    <strong>Name: </strong>
                                    {selectedNode.name}
                                </p>
                                <p>PARENT NODE</p>
                            </Card>
                        ))}
                </CardsContainer>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No data"
                    imageStyle={{ height: 60 }}
                />
            )}
        </div>
    )
}
