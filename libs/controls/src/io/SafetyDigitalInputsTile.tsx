/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useSafetyDigitalInputList, useSafetyDigitalInputState } from "@glowbuzzer/store"
import {
    StyledDivider,
    StyledSafetyDigitalInputs,
    StyledSafetyDigitalInputsRow,
    StyledSafetyTileContent,
    StyledToolTipDiv
} from "../util/styles/StyledTileContent"
import { Select, Switch, Tag, Tooltip } from "antd"
import { StyledDigitalInputs } from "./DigitalInputsTile"
import { parseDescription } from "./SafetyIoUtils"

const { Option } = Select

const SafetyDigitalInputItem = ({
    index,
    label,
    description,
    states
}: {
    index: number
    label?: string
    description?: string
    states?: { state: number; label: string; isError: boolean }[]
}) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    const activeState = states?.find(state => state.state === (din.actValue ? 1 : 0))
    const activeStateLabel = activeState?.label || (din.actValue ? "ON" : "OFF")

    const activeStateColor = activeState?.isError ? "red" : "green"

    function handle_override_change(value) {
        setDin(din.override, value)
    }

    function handle_state_change() {
        const new_state = !din.setValue
        setDin(new_state, din.override)
    }

    return (
        <StyledSafetyDigitalInputsRow>
            <StyledToolTipDiv>
                <Tooltip
                    title={label}
                    placement="top"
                    mouseEnterDelay={2}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div className="din-label">{description || "Unknown"}</div>
                </Tooltip>
            </StyledToolTipDiv>
            <div>
                <Select
                    size="small"
                    value={din.override ? 1 : 0}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!din.override}
                checked={din.setValue}
                onChange={handle_state_change}
            />
            <div>
                {/*<Tag color={din.actValue ? "green" : "red"}>{din.actValue ? "ON" : "OFF"}</Tag>*/}
                <Tag color={activeStateColor}>{activeStateLabel}</Tag>
            </div>
        </StyledSafetyDigitalInputsRow>
    )
}

type SafetyDigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The safety digital inputs tile shows a simple view of all current digital input values.
 */
export const SafetyDigitalInputsTile = ({ labels = [] }: SafetyDigitalInputsTileProps) => {
    const dins = useSafetyDigitalInputList()

    return (
        <StyledSafetyTileContent>
            <StyledSafetyDigitalInputs>
                {dins?.map((config, index) => {
                    const { description, states } = parseDescription(config.description || "")

                    return (
                        <SafetyDigitalInputItem
                            key={index}
                            index={index}
                            label={labels[index] || config.name || index.toString()}
                            description={description}
                            states={states}
                        />
                    )
                })}
            </StyledSafetyDigitalInputs>
        </StyledSafetyTileContent>
    )
}
