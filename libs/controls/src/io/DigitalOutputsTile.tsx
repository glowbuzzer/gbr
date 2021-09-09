import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Select, Switch, Tag } from "antd"
import styled from "styled-components"
import { useDigitalOutput, useDigitalOutputList } from "@glowbuzzer/store"

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

const DigitalOutputItem = ({ index, name, label }: { index: number; name: string; label?: string }) => {
    const dout = useDigitalOutput(index)

    function handle_override_change(value) {
        dout.set(dout.state, value)
    }

    function handle_state_change() {
        const new_state = 1 - dout.state
        dout.set(new_state, dout.override)
    }

    return (
        <div>
            <div className="dout-label">{label || "Unknown"}</div>
            <div>
                <Select size="small" value={dout.override ? 1 : 0} style={{ width: "90px" }} onChange={handle_override_change}>
                    <Option value={0}>Auto</Option>
                    <Option value={1}>Override</Option>
                </Select>
            </div>
            <Switch disabled={!dout.override} checked={dout.state && true} onChange={handle_state_change} />
            <div>
                <Tag>{dout.actState ? "ON" : "OFF"}</Tag>
            </div>
        </div>
    )
}

export const DigitalOutputsTile = ({ labels=[] }) => {
    const douts = useDigitalOutputList()

    return (
        <Tile title="Digital Outputs">
            <StyledDiv>
                {douts.map((name, index) => (
                    <DigitalOutputItem key={index} index={index} name={name} label={labels[index]} />
                ))}
            </StyledDiv>
        </Tile>
    )
}
