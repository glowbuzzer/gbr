/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/**
 * This component provides an example of how to use the digital inputs override hook.
 * This hook is useful if you want to simulate digital inputs during development.
 * See `useDigitalInputOverrides` in @glowbuzzer/store for more information.
 */
import React from "react"
import { useDigitalInputOverrides, useDigitalInputs } from "@glowbuzzer/store"
import { Select, Switch, Tag } from "antd"
import styled from "styled-components"

const { Option } = Select

const StyledDiv = styled.div`
    padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }

    .item-label {
        flex-grow: 1;
    }
`

const DigitalInputOverrideItem = ({ index, item, label }) => {
    const digitalInputOverrides = useDigitalInputOverrides()

    function handle_override_change(value) {
        const is_set = value === 1
        digitalInputOverrides.set(index, is_set, !!item.state)
    }

    function handle_state_change() {
        digitalInputOverrides.set(index, true, !item.state)
    }

    return (
        <div>
            <div className="item-label">{label || "Unknown"}</div>
            <div>
                <Select
                    size="small"
                    value={item.override ? 1 : 0}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!item.override}
                checked={item.state && true}
                onChange={handle_state_change}
            />
            <div>
                <Tag>{item.actState ? "ON" : "OFF"}</Tag>
            </div>
        </div>
    )
}

export const DigitalInputOverrideTile = ({ labels }) => {
    const dins = useDigitalInputs()
    const digitalInputOverrides = useDigitalInputOverrides()

    return (
        <StyledDiv>
            {dins.map((di, index) => {
                const item = {
                    actState: di,
                    state: digitalInputOverrides.get(index),
                    override: digitalInputOverrides.isOverridden(index)
                }
                return (
                    <DigitalInputOverrideItem
                        key={index}
                        index={index}
                        label={labels[index]}
                        item={item}
                    />
                )
            })}
        </StyledDiv>
    )
}