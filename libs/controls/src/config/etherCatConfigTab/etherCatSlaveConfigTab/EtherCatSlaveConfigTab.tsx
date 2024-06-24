import React from "react"
import { useEffect, useState, useRef } from "react"
import {
    Form,
    Input,
    InputNumber,
    Button,
    Collapse,
    message,
    Space,
    Alert,
    Card,
    Table,
    Empty,
    Spin,
    Tooltip
} from "antd"
import {
    EtherCatConfig,
    DriveLimits,
    Sdo,
    Slave,
    OptionalConfig,
    GbParams,
    GbDebugParams,
    exampleConfig
} from "../EtherCatConfigTypes"
import { useConnection } from "@glowbuzzer/store"
import { isMachineConfig } from "../isEtherCatConfig"
import { useEtherCatConfig } from "../EtherCatConfigContext"
import EtherCatConfigStatusIndicator from "../EtherCatConfigStatusIndicator" // Ensure these types are correctly imported or defined
import type { ColumnsType } from "antd/es/table"
import { useSlaveCat } from "../slaveCatData/slaveCatContext"
import { slave } from "../slavecatTypes/Slave"
import { SimpleObject } from "../slavecatTypes/SimpleObject"

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import styled from "styled-components"

const { Panel } = Collapse

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
                        }
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            </Form>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24, cursor: "pointer" }}
                onClick={toggleEdit}
            >
                {children}
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
    console.log(config)
    console.log(slaveData)
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
            console.log("Found", obj.name, obj)
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

    const findIfOptional = (slaveName: string): boolean => {
        console.log(slaveName)
        const slave = config.ethercat.slaves.find(slave => slave.eep_name === slaveName)
        if (slave) {
            return slave.optional.is_configurable ? slave.optional.is_enabled : false
        }
        return false
    }

    const columns: ColumnsType<EnhancedSdo> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (_, record) => findObjectName(record.slaveName, record.index, record.sub_index)
        },
        {
            title: "Datatype",
            dataIndex: "datatype",
            key: "datatype"
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
    const { request } = useConnection()

    const {
        config,
        setConfig,
        setEditedConfig,
        editedConfig,
        configLoaded,
        setConfigLoaded,
        setUseDummyConfig,
        useDummyConfig
    } = useEtherCatConfig()

    const slaveData: slave[] = useSlaveCat()

    return (
        <>
            <EtherCatConfigStatusIndicator />
            <Space>
                Edit the configuration of EtherCAT slaves (applied at start-up of the network)
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
        </>
    )
}
