import * as React from "react"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { configSlice, useIntegerInputList, useUnsignedIntegerInputList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Checkbox, Empty, Input, Space, Tooltip } from "antd"
import { StyledFlex } from "./commonStyles"
import { ActionButton, TooltipWrapper } from "./CommonComponents"

export const StandardUnsidedIntegerInputs: React.FC = () => {
    const current = useUnsignedIntegerInputList()
    const [inputs, setInputs] = useState(current)
    const dispatch = useDispatch()

    function reset() {
        setInputs(current)
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                uiin: inputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs(current =>
            current.map((input, i) => (i === index ? { ...input, name: e.target.value } : input))
        )
    }

    const modified = JSON.stringify(inputs) !== JSON.stringify(current)

    return (
        <StyledFlex>
            <div className="integer-input-grid">
                {inputs?.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No integer inputs have been configured"
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
                    <span style={{ fontStyle: "italic" }}>
                        These are a maximum of 32 bits wide, UNsigned integer inputs.
                    </span>
                </div>
            )}
        </StyledFlex>
    )
}
