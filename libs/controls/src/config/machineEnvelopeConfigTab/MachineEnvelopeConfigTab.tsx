import React, { useState } from "react"
import { Select, Button, List, message, Form, Input, Checkbox, Modal } from "antd"
import { FormInstance } from "antd/lib/form"

const { Option } = Select

interface PlaneConstraint {
    type: "Plane"
    data: {
        direction: "X" | "Y" | "Z"
        insideOutside: boolean
        position: number
    }
}

interface BoxConstraint {
    type: "Box"
    data: {
        pointX: number
        pointY: number
        pointZ: number
        lengthA: number
        lengthB: number
        lengthC: number
        insideOutside: boolean
    }
}

interface CylinderConstraint {
    type: "Cylinder"
    data: {
        pointX: number
        pointY: number
        pointZ: number
        radius: number
        height: number
        insideOutside: boolean
        axis: "X" | "Y" | "Z"
    }
}

interface SphereConstraint {
    type: "Sphere"
    data: {
        pointX: number
        pointY: number
        pointZ: number
        radius: number
        insideOutside: boolean
    }
}

type Constraint = PlaneConstraint | BoxConstraint | CylinderConstraint | SphereConstraint

export const MachineEnvelopeConfigTab = () => {
    const [constraints, setConstraints] = useState<Constraint[]>([])
    const [selectedConstraint, setSelectedConstraint] = useState<Constraint["type"] | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [form] = Form.useForm()

    const handleAddConstraint = () => {
        if (!selectedConstraint) {
            message.error("Please select a constraint type")
            return
        }

        if (selectedConstraint === "Plane" && constraints.some(c => c.type !== "Plane")) {
            message.error("Cannot add Plane when Box, Cylinder or Sphere is present")
            return
        }

        if (["Box", "Cylinder", "Sphere"].includes(selectedConstraint) && constraints.length > 0) {
            message.error("Cannot add Box, Cylinder or Sphere when other constraints are present")
            return
        }

        if (
            selectedConstraint === "Plane" &&
            constraints.filter(c => c.type === "Plane").length >= 3
        ) {
            message.error("Cannot add more than 3 Planes")
            return
        }

        setIsModalVisible(true)
    }

    const handleModalOk = () => {
        form.validateFields()
            .then(values => {
                setConstraints([...constraints, { type: selectedConstraint!, data: values }])
                setSelectedConstraint(null)
                setIsModalVisible(false)
                form.resetFields()
            })
            .catch(info => {
                console.log("Validate Failed:", info)
            })
    }

    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
    }

    const renderFormFields = () => {
        switch (selectedConstraint) {
            case "Plane":
                return (
                    <>
                        <Form.Item name="direction" label="Direction" rules={[{ required: true }]}>
                            <Select>
                                <Option value="X">X</Option>
                                <Option value="Y">Y</Option>
                                <Option value="Z">Z</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="insideOutside" valuePropName="checked">
                            <Checkbox>Inside/Outside</Checkbox>
                        </Form.Item>
                        <Form.Item
                            name="position"
                            label="Position"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </>
                )
            case "Box":
                return (
                    <>
                        <Form.Item
                            name="pointX"
                            label="Point X"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointY"
                            label="Point Y"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointZ"
                            label="Point Z"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="lengthA"
                            label="Length A"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="lengthB"
                            label="Length B"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="lengthC"
                            label="Length C"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="insideOutside" valuePropName="checked">
                            <Checkbox>Inside/Outside</Checkbox>
                        </Form.Item>
                    </>
                )
            case "Cylinder":
                return (
                    <>
                        <Form.Item
                            name="pointX"
                            label="Point X"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointY"
                            label="Point Y"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointZ"
                            label="Point Z"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="radius"
                            label="Radius"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="height"
                            label="Height"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="insideOutside" valuePropName="checked">
                            <Checkbox>Inside/Outside</Checkbox>
                        </Form.Item>
                        <Form.Item name="axis" label="Axis" rules={[{ required: true }]}>
                            <Select>
                                <Option value="X">X</Option>
                                <Option value="Y">Y</Option>
                                <Option value="Z">Z</Option>
                            </Select>
                        </Form.Item>
                    </>
                )
            case "Sphere":
                return (
                    <>
                        <Form.Item
                            name="pointX"
                            label="Point X"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointY"
                            label="Point Y"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="pointZ"
                            label="Point Z"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="radius"
                            label="Radius"
                            rules={[{ required: true, type: "number" }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="insideOutside" valuePropName="checked">
                            <Checkbox>Inside/Outside</Checkbox>
                        </Form.Item>
                    </>
                )
            default:
                return null
        }
    }

    return (
        <div style={{ padding: "10px" }}>
            <Select
                value={selectedConstraint}
                onChange={value => setSelectedConstraint(value as Constraint["type"])}
                style={{ width: 200, marginRight: 10 }}
                placeholder="Select constraint type"
                size="small"
            >
                <Option value="Plane">Plane</Option>
                <Option value="Box">Box</Option>
                <Option value="Cylinder">Cylinder</Option>
                <Option value="Sphere">Sphere</Option>
            </Select>
            <Button size="small" type="primary" onClick={handleAddConstraint}>
                Add Constraint
            </Button>

            <List
                header={<div>Added Constraints</div>}
                bordered
                size="small"
                dataSource={constraints}
                renderItem={item => (
                    <List.Item>
                        {item.type}: {JSON.stringify(item.data)}
                    </List.Item>
                )}
                style={{ marginTop: 20 }}
            />

            <Modal
                title="Add Constraint Data"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    {renderFormFields()}
                </Form>
            </Modal>
        </div>
    )
}
// <p>Machine envelope config content</p>
// <h2>bbh envelope</h2>
// <p>Plane X, Y, Z inside / outside</p>
// <p>Box inside / outside</p>
// <p>Cylinder inside / outside</p>
// <p>Sphere inside / outside</p>
