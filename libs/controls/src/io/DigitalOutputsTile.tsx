/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Tile } from "../tiles"
import { Select, Switch, Tag } from "antd"
import styled from "styled-components"
import { useDigitalOutputList, useDigitalOutputState } from "@glowbuzzer/store"

const help = (
    <div>
        <h4>Digital Outputs Tile</h4>
        <p>The Digital Outputs Tile allows you to control analog outputs on your machine.</p>
        <p>
            If you want your outputs to be controlled by your programs (or gcode) then set "Auto"
            mode in the dropdown.{" "}
        </p>
        <p>
            If you want to force the value of the output from the Tile, set "Override" mode in the
            dropdown.
        </p>
        <p>In overide mode the value can be changed with the toggle switch.</p>
        <p>
            The current value of the output will be shown in the state indicator on the far right.
        </p>
    </div>
)

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
`

const DigitalOutputItem = ({ index, label }: { index: number; label?: string }) => {
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
            <div className="dout-label">{label || "Unknown"}</div>
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
                <Tag>{dout.effectiveValue ? "ON" : "OFF"}</Tag>
            </div>
        </div>
    )
}

type DigitalOutputsTileProps = {
    /**
     * Labels to use for outputs, in the order given in the configuration
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
        <Tile title={"Digital Outputs"} help={help}>
            <StyledDiv>
                {douts?.map((config, index) => (
                    <DigitalOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                    />
                ))}
            </StyledDiv>
        </Tile>
    )
}
