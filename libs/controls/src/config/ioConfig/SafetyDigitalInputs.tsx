import * as React from "react"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { configSlice, useSafetyDigitalInputList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CloseOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { Button, Checkbox, Empty, Input, Space, Tooltip } from "antd"
import { StyledFlex, StyledToolTipDiv } from "./commonStyles"
import { ActionButton, TooltipWrapper } from "./CommonComponents"

export const SafetyDigitalInputs: React.FC = () => {
    const current = useSafetyDigitalInputList()
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
                {" "}
                {inputs?.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No digital inputs have been configured"
                        imageStyle={{ height: 60 }}
                    />
                ) : (
                    inputs.map((input, index) => (
                        <React.Fragment key={index}>
                            <TooltipWrapper title="This is the fixed description of the IO object">
                                {input.description}
                            </TooltipWrapper>
                            <TooltipWrapper title="Edit the name of the IO object">
                                <div>
                                    <Input
                                        type="text"
                                        value={input.name}
                                        onChange={e => update_name(index, e)}
                                    />
                                </div>
                            </TooltipWrapper>
                            <TooltipWrapper title="Choose if the IO object is inverted">
                                <Checkbox
                                    checked={input.inverted}
                                    onChange={e => update_inverted(index, e)}
                                >
                                    Inverted
                                </Checkbox>
                            </TooltipWrapper>
                        </React.Fragment>
                    ))
                )}
            </div>
            {inputs.length !== 0 && (
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
