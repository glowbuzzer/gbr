import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Switch } from "antd"
import styled from "@emotion/styled"
import { useDigitalOutput } from "@glowbuzzer/store"

const StyledDiv = styled.div`
    padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }

    .ant-switch {
        flex-grow: 1;
        margin: 10px 20px;
    }
`

export const TutorialDoToggleTile = ({ labels = [] }) => {
    const dout = useDigitalOutput(1)

    function handle_state_change() {
        const new_state = 1 - dout.state
        dout.set(new_state, true)
    }

    return (
        <Tile title="Tutorial Digital Output Toggle">
            <StyledDiv>
                Turn on my digital output
                <Switch checked={dout.state && true} onChange={handle_state_change} />
            </StyledDiv>
        </Tile>
    )
}
