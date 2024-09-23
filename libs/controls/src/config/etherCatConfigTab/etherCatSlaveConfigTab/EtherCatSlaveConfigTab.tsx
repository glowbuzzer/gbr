import React, { useEffect, useRef, useState } from "react"
import {
    Card,
    Collapse,
    Empty,
    Form,
    Input,
    InputNumber,
    Space,
    Spin,
    Switch,
    Table,
    Tooltip
} from "antd"
import { EtherCatConfig, Sdo } from "../EtherCatConfigTypes"
import { useEtherCatConfig } from "../EtherCatConfigContext"
import EtherCatConfigStatusIndicator from "../EtherCatConfigStatusIndicator" // Ensure these types are correctly imported or defined
import type { ColumnsType } from "antd/es/table"
import { useSlaveCat } from "../slaveCatData/slaveCatContext"
import { slave } from "../slavecatTypes/Slave"
import { SimpleObject } from "../slavecatTypes/SimpleObject"

import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons"
import styled, { useTheme } from "styled-components"
import { ethercatDataTypes } from "../slavecatTypes/ethercatTypes"
import { RequireEstopGuard } from "../../util/RequireEstopGuard"

const { Panel } = Collapse

const StyledToolTipDiv = styled.div`
    /* Target the outer tooltip wrapper when the tooltip is placed at the top */
    position: relative;
    display: inline-block; // Ensures inline behavior which is crucial for tooltips

    .ant-tooltip-placement-right > .ant-tooltip-content {
        margin-left: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }

    .ant-tooltip-inner {
        width: 600px;
        white-space: normal; /* Allow the text to wrap */
    }
`

// Extend Sdo to include slaveName
interface EnhancedSdo extends Sdo {
    slaveName: string
    editable: boolean
}

interface Props {
    config: EtherCatConfig
    slaveData: slave[]
}

const HeaderText = styled.div<{ isOptional: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ isOptional }) => (isOptional ? "grey" : "inherit")};
`

const findDataTypeString = (datatypeNumber: number) => {
    const dataType = ethercatDataTypes.find(type => type.index === datatypeNumber)
    return dataType ? dataType.dataType : "Unknown"
}

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const [form] = Form.useForm()

    const theme = useTheme()

    useEffect(() => {
        if (editing) {
            inputRef.current.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        })
    }

    const save = async () => {
        try {
            const values = await form.validateFields()
            toggleEdit()
            handleSave({ ...record, ...values })
        } catch (errInfo) {
            console.log("Save failed:", errInfo)
        }
    }

    let childNode = children

    if (editable) {
        childNode = editing ? (
            <Form form={form} component={false}>
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`
                        },
                        {
                            validator: (_, value) => {
                                const dataType = ethercatDataTypes.find(
                                    dt => dt.index === record.datatype
                                )

                                if (dataType) {
                                    const { tsType, bitSize } = dataType

                                    let convertedValue = value
                                    if (tsType === "boolean") {
                                        convertedValue = value === "true"
                                    } else if (tsType === "number") {
                                        convertedValue = Number(value)
                                    }

                                    // console.log("tsType", tsType)
                                    // console.log("convertedValue", convertedValue)
                                    // console.log("typeof", typeof convertedValue)

                                    if (
                                        (tsType === "boolean" &&
                                            typeof convertedValue !== "boolean") ||
                                        (tsType === "number" &&
                                            typeof convertedValue !== "number") ||
                                        (tsType === "string" && typeof convertedValue !== "string")
                                    ) {
                                        return Promise.reject(
                                            new Error(`Value must be of type ${tsType}`)
                                        )
                                    }
                                    if (
                                        tsType === "number" &&
                                        (convertedValue < -(2 ** (bitSize - 1)) ||
                                            convertedValue > 2 ** (bitSize - 1) - 1)
                                    ) {
                                        return Promise.reject(
                                            new Error(
                                                `Value must be within the range for ${bitSize}-bit number`
                                            )
                                        )
                                    }
                                }
                                return Promise.resolve()
                            }
                        }
                    ]}
                >
                    {/*<Input ref={inputRef} onPressEnter={save} onBlur={save} />*/}
                    {(() => {
                        const dataType = ethercatDataTypes.find(dt => dt.index === record.datatype)

                        if (dataType && dataType.tsType === "number") {
                            return (
                                <InputNumber
                                    size="small"
                                    ref={inputRef}
                                    onPressEnter={save}
                                    onBlur={save}
                                />
                            )
                        } else if (dataType && dataType.tsType === "boolean") {
                            return (
                                <Switch
                                    size="small"
                                    ref={inputRef}
                                    checkedChildren="True"
                                    unCheckedChildren="False"
                                    defaultChecked={record[dataIndex] === "true"}
                                    onChange={save}
                                />
                            )
                        } else {
                            return (
                                <Input
                                    size="small"
                                    ref={inputRef}
                                    onPressEnter={save}
                                    onBlur={save}
                                />
                            )
                        }
                    })()}
                </Form.Item>
            </Form>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24, cursor: "pointer" }}
                onClick={toggleEdit}
            >
                {children}
                <Tooltip title={"Edit the value"}>
                    <EditOutlined
                        style={{ marginLeft: 8, color: theme.colorPrimary }}
                    ></EditOutlined>
                </Tooltip>
            </div>
        )
    }

    return <td {...restProps}>{childNode}</td>
}

const SlaveSDOTable: React.FC<Props> = ({ config, slaveData }) => {
    const computeSlaveCounts = slaves => {
        let count = 1
        return slaves.map(slave => {
            if (findIfOptional(slave.eep_name)) {
                return { ...slave, count: null }
            } else {
                return { ...slave, count: count++ }
            }
        })
    }
    const { editedConfig, setEditedConfig, setConfigEdited } = useEtherCatConfig()

    const handleSave = row => {
        // Find the correct slave and SDO to update
        const newData = [...editedConfig.ethercat.slaves]
        const slaveIndex = newData.findIndex(slave => slave.eep_name === row.slaveName)
        if (slaveIndex !== -1) {
            const sdoIndex = newData[slaveIndex].sdos.findIndex(
                sdo => sdo.index === row.index && sdo.sub_index === row.sub_index
            )
            if (sdoIndex !== -1) {
                newData[slaveIndex].sdos[sdoIndex] = {
                    ...newData[slaveIndex].sdos[sdoIndex],
                    value: row.value
                }
            }
        }
        setEditedConfig({
            ...editedConfig,
            ethercat: { ...editedConfig.ethercat, slaves: newData }
        })
        setConfigEdited(true)
    }

    const components = {
        body: {
            cell: EditableCell
        }
    }

    if (!config || !config.ethercat || !slaveData) {
        // Display loading or empty state if config is not yet available
        return <Spin tip="Loading configuration..." />
    }
    // console.log(config)
    // console.log(slaveData)
    if (config.ethercat.slaves.length === 0) {
        // Display a message if there are no slaves
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="The EtherCAT configuration does not contain any slaves"
                imageStyle={{ height: 60 }}
            />
        )
    }

    // Helper function to find the name based on index and subIndex
    const findObjectName = (slaveName: string, index: number, subIndex: number): string => {
        const matchingSlave = slaveData.find(slave => slave.name === slaveName)
        // console.log(matchingSlave)
        if (!matchingSlave) return "Unknown"

        for (const obj of matchingSlave.slaveInfo.simpleSlaveObjects) {
            const foundName = searchSimpleObject(obj, index, subIndex)
            if (foundName) return foundName
        }

        return "Unknown"
    }

    // Recursive function to search through SimpleObject and its children
    const searchSimpleObject = (
        obj: SimpleObject,
        index: number,
        subIndex: number
    ): string | null => {
        // console.log(index, subIndex, obj.index, obj.subIndex)
        if (obj.index === index && obj.subIndex === subIndex) {
            // console.log("Found", obj.name, obj)
            return obj.name
        }
        if (obj.children) {
            for (const child of obj.children) {
                const found = searchSimpleObject(child, index, subIndex)
                if (found) return found
            }
        }
        return null
    }

    const searchSimpleObjectDescription = (
        obj: SimpleObject,
        index: number,
        subIndex: number
    ): string | null => {
        if (obj.index === index && obj.subIndex === subIndex) {
            return obj.description || "No description available"
        }
        if (obj.children) {
            for (const child of obj.children) {
                const found = searchSimpleObjectDescription(child, index, subIndex)
                if (found) return found
            }
        }
        return null
    }

    const findObjectDescription = (slaveName: string, index: number, subIndex: number): string => {
        const matchingSlave = slaveData.find(slave => slave.name === slaveName)
        if (!matchingSlave) return "No description available"

        for (const obj of matchingSlave.slaveInfo.simpleSlaveObjects) {
            const foundDescription = searchSimpleObjectDescription(obj, index, subIndex)
            if (foundDescription) return foundDescription
        }

        return "No description available"
    }

    const findIfOptional = (slaveName: string): boolean => {
        // console.log(slaveName)
        const slave = config.ethercat.slaves.find(slave => slave.eep_name === slaveName)
        // console.log("slaveName", slaveName)
        // console.log("slave", slave)
        if (slave) {
            if (!slave.optional.is_configurable) return false

            return !slave.optional.is_enabled
        }
        return false
    }

    const columns: ColumnsType<EnhancedSdo> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            // render: (_, record) => findObjectName(record.slaveName, record.index, record.sub_index)
            render: (_, record) => {
                const description = findObjectDescription(
                    record.slaveName,
                    record.index,
                    record.sub_index
                )
                return (
                    <StyledToolTipDiv>
                        <Tooltip
                            title={<div dangerouslySetInnerHTML={{ __html: description }} />}
                            placement="right"
                            mouseEnterDelay={2}
                            getPopupContainer={triggerNode => triggerNode}
                        >
                            <span>
                                {findObjectName(record.slaveName, record.index, record.sub_index)}
                            </span>
                        </Tooltip>
                    </StyledToolTipDiv>
                )
            }
        },
        {
            title: "Datatype",
            dataIndex: "datatype",
            key: "datatype",
            render: (_, record) => findDataTypeString(record.datatype)
        },
        {
            title: "Index",
            dataIndex: "index",
            key: "index",
            render: (index: number) => `0x${index.toString(16).toUpperCase()}` // Convert to hex
        },
        {
            title: "Sub-Index",
            dataIndex: "sub_index",
            key: "sub_index"
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            editable: true // Mark as editable
        },
        {
            title: "Length",
            dataIndex: "length",
            key: "length"
        }
    ].map(col => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave
            })
        }
    })

    return (
        <Collapse accordion style={{ marginBottom: 20 }} expandIconPosition="right">
            {computeSlaveCounts(config.ethercat.slaves).map((slave, slaveIndex) => (
                <Panel
                    key={slaveIndex}
                    header={
                        <HeaderText isOptional={findIfOptional(slave.eep_name)}>
                            {`${slave.count !== null ? `#${slave.count} ` : ""}${slave.name} (${
                                slave.sdos.length
                            })`}
                            {findIfOptional(slave.eep_name) ? (
                                <Tooltip title="Slave is excluded from the machine's config (optional slave)">
                                    <CloseCircleOutlined style={{ color: "red" }} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Slave is included in the machine's config">
                                    <CheckCircleOutlined style={{ color: "green" }} />
                                </Tooltip>
                            )}
                        </HeaderText>
                    }
                >
                    <Card style={{ marginBottom: 20 }} size="small">
                        <Table
                            components={components}
                            dataSource={slave.sdos.map(sdo => ({
                                ...sdo,
                                slaveName: slave.eep_name
                            }))}
                            columns={columns}
                            rowKey={record => `${record.index}-${record.sub_index}`}
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Panel>
            ))}
        </Collapse>
    )
}

type EtherCatSlaveConfigTabProps = {}

export const EtherCatSlaveConfigTab: React.FC<EtherCatSlaveConfigTabProps> = ({}) => {
    const { editedConfig, configLoaded } = useEtherCatConfig()

    const slaveData: slave[] = useSlaveCat()

    return (
        <RequireEstopGuard>
            <EtherCatConfigStatusIndicator />
            <Space>
                Edit the configuration of EtherCAT slaves (applied at start-up of the network)
                {/*<Button*/}
                {/*    size="small"*/}
                {/*    onClick={() => {*/}
                {/*        setUseDummyConfig(!useDummyConfig)*/}
                {/*        setConfigLoaded(false) // Reset config loaded status*/}
                {/*    }}*/}
                {/*    style={{ marginLeft: 8 }}*/}
                {/*>*/}
                {/*    {useDummyConfig ? "Switch to Real Config" : "Switch to Dummy Config"}*/}
                {/*</Button>*/}
            </Space>
            {configLoaded ? (
                <div style={{ padding: 20 }}>
                    <SlaveSDOTable config={editedConfig} slaveData={slaveData} />
                </div>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No EtherCAT config has been loaded"
                    imageStyle={{ height: 60 }}
                />
            )}
        </RequireEstopGuard>
    )
}
