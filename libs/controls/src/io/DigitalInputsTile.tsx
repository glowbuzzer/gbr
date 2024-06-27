/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    useDigitalInputList,
    useDigitalInputs,
    useDigitalInputState,
    useDigitalOutputState
} from "@glowbuzzer/store"
import { StyledTileContent, StyledToolTipDiv } from "../util/styles/StyledTileContent"
import { Select, Switch, Tag, Tooltip } from "antd"

import styled from "styled-components"

const { Option } = Select

export const StyledDigitalInputs = styled.div`
    > div {
        display: flex;
        gap: 10px;
    }

    .din-label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

const DigitalInputItem = ({ index, label }: { index: number; label?: string }) => {
    const [din, setDin] = useDigitalInputState(index)

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

type DigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital inputs tile shows a simple view of all current digital input values.
 */
export const DigitalInputsTile = ({ labels = [] }: DigitalInputsTileProps) => {
    const dins = useDigitalInputList()

    return (
        <StyledTileContent>
            <StyledDigitalInputs>
                {dins?.map((config, index) => (
                    <DigitalInputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                    />
                ))}
            </StyledDigitalInputs>
        </StyledTileContent>
    )
}
