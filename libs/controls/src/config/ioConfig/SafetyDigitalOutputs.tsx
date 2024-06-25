import * as React from "react"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { configSlice, useSafetyDigitalOutputList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CloseOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { Button, Checkbox, Empty, Input, InputNumber, Space, Tooltip } from "antd"
import { CenteredCheckbox, StyledFlex } from "./commonStyles"
import { ActionButton, TooltipWrapper } from "./CommonComponents"

export const SafetyDigitalOutputs: React.FC = () => {
    const current = useSafetyDigitalOutputList()
    const [outputs, setOutputs] = useState(current)
    const dispatch = useDispatch()

    function reset() {
        setOutputs(current)
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                dout: outputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setOutputs(current =>
            current.map((input, i) => (i === index ? { ...input, name: e.target.value } : input))
        )
    }

    function update_loopback(index: number, value: number) {
        setOutputs(current =>
            current.map((output, i) => (i === index ? { ...output, loopback: value } : output))
        )
    }

    const modified = JSON.stringify(outputs) !== JSON.stringify(current)

    return (
        <StyledFlex>
            <div className="digital-output-grid">
                {outputs?.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No digital outputs have been configured"
                        imageStyle={{ height: 60 }}
                    />
                ) : (
                    outputs.map((output, index) => (
                        <React.Fragment key={index}>
                            <TooltipWrapper title="This is the fixed description of the IO object">
                                {output.description}
                            </TooltipWrapper>
                            <TooltipWrapper title="Edit the name of the IO object">
                                <div>
                                    <Input
                                        type="text"
                                        value={output.name}
                                        onChange={e => update_name(index, e)}
                                    />
                                </div>
                            </TooltipWrapper>

                            <TooltipWrapper title="Choose which input the IO object is looped back to">
                                <div>
                                    <Input
                                        type="number"
                                        value={output.loopback}
                                        onChange={e =>
                                            update_loopback(index, Number(e.target.value))
                                        }
                                        step={1}
                                        min={0}
                                        max={64}
                                        defaultValue={0}
                                    />
                                </div>
                            </TooltipWrapper>
                        </React.Fragment>
                    ))
                )}
            </div>
            {outputs.length !== 0 && (
                <div className="actions">
                    <Space>
                        <ActionButton
                            onClick={save}
                            disabled={!modified}
                            tooltipTitle="Save the config to the database"
                            type="primary"
                        >
                            Save
                        </ActionButton>
                        <ActionButton
                            onClick={reset}
                            disabled={!modified}
                            tooltipTitle="Reset changes made to the IO config"
                            type="default"
                        >
                            Reset
                        </ActionButton>
                    </Space>
                </div>
            )}
        </StyledFlex>
    )
}
