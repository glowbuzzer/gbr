import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { BitFieldDisplay } from "@glowbuzzer/controls"
import { useDigitalInputs } from "@glowbuzzer/store"
import { Select, Tag } from "antd"
import styled from "styled-components"
import { useDigitalOutputs } from "../../../../../libs/store/src/dout"

const { Option } = Select

const StyledDiv = styled.div`
    padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }
`

export const DigitalIoTile = () => {
    const din = useDigitalInputs()
    const dout = useDigitalOutputs()

    function handle_change(index, value) {
        dout.update(index, {
            override: value > 0,
            state: value === 1 ? 1 : 0
        })
    }

    function get_value(index) {
        const { override, state } = dout.values[index]
        return override ? (state ? 1 : 2) : 0
    }

    const dinValue = din.reduce((value, current, index) => value | (current ? 1 << index : 0), 0)
    return (
        <Tile title="Digital In/Out">
            <BitFieldDisplay bitCount={16} value={dinValue} labels={["BLINKY"]} />

            <StyledDiv>
                {dout.values.map((v, index) => (
                    <div key={index}>
                        <div>
                            <Select value={get_value(index)} style={{ width: "120px" }} onChange={e => handle_change(index, e)}>
                                <Option value={0}>Program</Option>
                                <Option value={1}>Set ON</Option>
                                <Option value={2}>Set OFF</Option>
                            </Select>
                        </div>
                        <div>
                            <Tag>{v.actState ? "ON" : "OFF"}</Tag>
                        </div>
                    </div>
                ))}
            </StyledDiv>
        </Tile>
    )
}
