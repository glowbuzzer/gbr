import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Switch } from "antd"
import styled from "styled-components"
import { useDigitalOutputState } from "@glowbuzzer/store"

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

export const TutorialDoToggleTile = () => {
    const [dout, setDout] = useDigitalOutputState(1)

    function handle_state_change() {
        const new_state = !dout.setValue
        setDout(new_state, true)
    }

    return (
        <Tile title="Tutorial Digital Output Toggle">
            <StyledDiv>
                Turn on my digital output
                <Switch checked={dout.setValue} onChange={handle_state_change} />
            </StyledDiv>
        </Tile>
    )
}
