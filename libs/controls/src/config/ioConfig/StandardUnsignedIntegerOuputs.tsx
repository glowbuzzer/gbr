import * as React from "react"
import { useState } from "react"
import { configSlice, useIntegerOutputList, useUnsignedIntegerOutputList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { Checkbox, Empty, Input, Space, Tooltip } from "antd"
import { StyledFlex } from "./commonStyles"
import { TooltipWrapper } from "./TooltipWrapper"
import { ActionButton } from "./ActionButton"

export const StandardUnsignedIntegerOuputs: React.FC = () => {
    const current = useUnsignedIntegerOutputList()
    const [outputs, setOutputs] = useState(current)
    const dispatch = useDispatch()

    function reset() {
        setOutputs(current)
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                uiout: outputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setOutputs(current =>
            current.map((input, i) => (i === index ? { ...input, name: e.target.value } : input))
        )
    }

    const modified = JSON.stringify(outputs) !== JSON.stringify(current)

    return (
        <StyledFlex>
            <div className="integer-input-grid">
                {outputs?.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No integer outputs have been configured"
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
                    <span style={{ fontStyle: "italic" }}>
                        These are a maximum of 32 bits wide, UNsigned integer outputs.
                    </span>
                </div>
            )}
        </StyledFlex>
    )
}
