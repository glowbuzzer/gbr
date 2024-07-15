/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Select, Switch, Tag, Tooltip } from "antd"
import styled from "styled-components"
import { useDigitalOutputList, useDigitalOutputState } from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const { Option } = Select

const StyledDiv = styled.div`
    //padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }

    .dout-label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

const DigitalOutputItem = ({
    index,
    label,
    description
}: {
    index: number
    label?: string
    description: string
}) => {
    const [dout, setDout] = useDigitalOutputState(index)

    function handle_override_change(value) {
        setDout(dout.override, value)
    }

    function handle_state_change() {
        const new_state = !dout.setValue
        setDout(new_state, dout.override)
    }

    return (
        <div>
            <Tooltip
                title={description}
                placement="top"
                mouseEnterDelay={2}
                getPopupContainer={triggerNode => triggerNode}
            >
                <div className="dout-label">{label || "Unknown"}</div>
            </Tooltip>
            <div>
                <Select
                    size="small"
                    value={dout.override ? 1 : 0}
                    style={{ width: "90px" }}
                    onChange={handle_override_change}
                >
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch
                disabled={!dout.override}
                checked={dout.setValue}
                onChange={handle_state_change}
            />
            <div>
                <Tag color={dout.effectiveValue ? "green" : "red"}>
                    {dout.effectiveValue ? "ON" : "OFF"}
                </Tag>
            </div>
        </div>
    )
}

type DigitalOutputsTileProps = {
    /**
     * Override labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital outputs tile allows you to view and control all digital outputs on a machine.
 *
 * By default (in auto mode) digital outputs are controlled by activities, either using the solo activity API
 * or streamed (for example, using G-code M200). However this tile (and the underlying hook) allows
 * you to override an digital output. When an digital output is overridden, the value you specify will
 * be used regardless of any changes from an activity. For example, if you execute some G-code with
 * an M201 code, but have overridden an digital output using this tile, the M200 code will be ignored.
 *
 */
export const DigitalOutputsTile = ({ labels = [] }: DigitalOutputsTileProps) => {
    const douts = useDigitalOutputList()

    return (
        <StyledTileContent>
            <StyledDiv>
                {douts?.map((config, index) => (
                    <DigitalOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                        description={config.description}
                    />
                ))}
            </StyledDiv>
        </StyledTileContent>
    )
}
