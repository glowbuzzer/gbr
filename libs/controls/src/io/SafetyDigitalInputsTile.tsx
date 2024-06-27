/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useSafetyDigitalInputList, useSafetyDigitalInputState } from "@glowbuzzer/store"
import { StyledSafetyTileContent } from "../util/styles/StyledTileContent"
import { Select, Switch, Tag } from "antd"
import { StyledDigitalInputs } from "./DigitalInputsTile"

const { Option } = Select

const SafetyDigitalInputItem = ({ index, label }: { index: number; label?: string }) => {
    const [din, setDin] = useSafetyDigitalInputState(index)

    function handle_override_change(value) {
        setDin(din.override, value)
    }

    function handle_state_change() {
        const new_state = !din.setValue
        setDin(new_state, din.override)
    }

    return (
        <div>
            <div className="din-label">{label || "Unknown"}</div>
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
                <Tag color={din.actValue ? "green" : "red"}>{din.actValue ? "ON" : "OFF"}</Tag>
            </div>
        </div>
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
            <StyledDigitalInputs>
                {dins?.map((config, index) => (
                    <SafetyDigitalInputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                    />
                ))}
            </StyledDigitalInputs>
        </StyledSafetyTileContent>
    )
}
