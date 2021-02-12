import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Select, Switch, Tag } from "antd"
import styled from "styled-components"
import { DigitalOutputStatus, useDigitalOutputs } from "@glowbuzzer/store"

const { Option } = Select

const StyledDiv = styled.div`
    padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }

    .dout-label {
        flex-grow: 1;
    }
`

const DigitalOutputItem = ({ index, item, label }: { index: number; item: DigitalOutputStatus; label?: string }) => {
    const dout = useDigitalOutputs()

    function handle_override_change(value) {
        dout.update(index, {
            override: value === 1,
            state: item.state
        })
    }

    function handle_state_change() {
        const new_state = 1 - item.state
        dout.update(index, {
            override: true,
            state: new_state
        })
    }

    return (
        <div>
            <div className="dout-label">{label || "Unknown"}</div>
            <div>
                <Select size="small" value={item.override ? 1 : 0} style={{ width: "90px" }} onChange={handle_override_change}>
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch disabled={!item.override} checked={item.state && true} onChange={handle_state_change} />
            <div>
                <Tag>{item.actState ? "ON" : "OFF"}</Tag>
            </div>
        </div>
    )
}

export const DigitalOutputsTile = ({ labels }) => {
    const dout = useDigitalOutputs()

    return (
        <Tile title="Digital Outputs">
            <StyledDiv>
                {dout.values.map((v, index) => (
                    <DigitalOutputItem key={index} index={index} item={v} label={labels[index]} />
                ))}
            </StyledDiv>
        </Tile>
    )
}
