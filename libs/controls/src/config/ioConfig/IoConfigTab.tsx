/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { Button, Card, Checkbox, Flex, Form, Input, InputNumber, Space, Switch } from "antd"
import styled from "styled-components"
import { configSlice, ModbusDinConfig, useDigitalInputList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"

const tabList = [
    {
        key: "standardDigitalInputs",
        tab: "Standard Digital Inputs"
    },
    {
        key: "modbusDigitalInputs",
        tab: "Modbus Digital Inputs"
    },
    {
        key: "standardDigitalOutputs",
        tab: "Standard Digital Outputs"
    },
    {
        key: "modbusDigitalOutputs",
        tab: "Modbus Digital Outputs"
    },
    {
        key: "standardIntegerInputs",
        tab: "Standard Integer Inputs"
    },
    {
        key: "modbusIntegerInputs",
        tab: "Modbus Integer Inputs"
    },
    {
        key: "standardIntegerOutputs",
        tab: "Standard Integer Outputs"
    },
    {
        key: "modbusIntegerOutputs",
        tab: "Modbus Integer Outputs"
    }
]

const StandardDigitalInputs: React.FC = () => {
    const current = useDigitalInputList()
    const [inputs, setInputs] = useState(current)
    const dispatch = useDispatch()

    function reset() {
        setInputs(current)
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                din: inputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs(current =>
            current.map((input, i) => (i === index ? { ...input, name: e.target.value } : input))
        )
    }

    function update_inverted(index: number, e: CheckboxChangeEvent) {
        setInputs(current =>
            current.map((input, i) =>
                i === index ? { ...input, inverted: e.target.checked } : input
            )
        )
    }

    const modified = JSON.stringify(inputs) !== JSON.stringify(current)

    return (
        <StyledFlex>
            <div className="digital-input-grid">
                {inputs.map((input, index) => (
                    <React.Fragment key={index}>
                        <div>{input.description}</div>
                        <div>
                            <Input
                                type="text"
                                value={input.name}
                                onChange={e => update_name(index, e)}
                            />
                        </div>
                        <div>
                            <Checkbox
                                checked={input.inverted}
                                onChange={e => update_inverted(index, e)}
                            >
                                Inverted
                            </Checkbox>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <div className="actions">
                <Space>
                    <Button type="primary" onClick={save} disabled={!modified}>
                        Save
                    </Button>
                    <Button onClick={reset} disabled={!modified}>
                        Reset
                    </Button>
                </Space>
            </div>
        </StyledFlex>
    )
}

interface ModbusDinFormProps {
    onSubmit: (config: ModbusDinConfig) => void
}

const ModbusDinForm: React.FC<ModbusDinFormProps> = ({ onSubmit }) => {
    const [form] = Form.useForm()

    const onFinish = (values: ModbusDinConfig) => {
        console.log("Received values:", values)
        onSubmit(values)
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ function: 1, little_endian: false }}
        >
            <Form.Item
                name="slave_num"
                label="Slave Number"
                rules={[{ required: true, message: "Please input the slave number!" }]}
            >
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input the address!" }]}
            >
                <InputNumber min={0} />
            </Form.Item>

            <Form.Item
                name="function"
                label="Function"
                rules={[{ required: true, message: "Please input the function (0x1 or 0x2)!" }]}
            >
                <InputNumber min={1} max={2} />
            </Form.Item>

            <Form.Item name="little_endian" label="Little Endian" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="reset" onClick={() => form.resetFields()}>
                        Reset
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

const ModbusDigitalInputs: React.FC = () => {
    const handleFormSubmit = (config: ModbusDinConfig) => {
        console.log("Config submitted:", config)
        // Perform further actions with the config object
    }

    return (
        <StyledFlex>
            <Space direction="vertical" size="small"></Space>
            <ModbusDinForm onSubmit={handleFormSubmit} />
        </StyledFlex>
    )
}

const contentList: Record<string, React.ReactNode> = {
    standardDigitalInputs: <StandardDigitalInputs />,
    modbusDigitalInputs: <ModbusDigitalInputs />,
    standardDigitalOutputs: <p>Content for Standard Digital Outputs</p>,
    modbusDigitalOutputs: <p>Content for Modbus Digital Outputs</p>,
    standardIntegerInputs: <p>Content for Standard Integer Inputs</p>,
    modbusIntegerInputs: <p>Content for Modbus Integer Inputs</p>,
    standardIntegerOutputs: <p>Content for Standard Integer Outputs</p>,
    modbusIntegerOutputs: <p>Content for Modbus Integer Outputs</p>
}

const StyledFlex = styled(Flex)`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }

    .digital-input-grid {
        display: grid;
        align-items: center;
        grid-template-columns: 2fr 3fr 1fr;
        gap: 10px;
    }
`

const IoCards: React.FC = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>("standardDigitalInputs")

    const onTabChange = (key: string) => {
        setActiveTabKey(key)
    }

    return (
        <Card
            style={{ width: "100%" }}
            title="IO Configuration"
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
            size="small"
        >
            {contentList[activeTabKey]}
        </Card>
    )
}

export const IoConfigTab = () => {
    return <IoCards />
}
