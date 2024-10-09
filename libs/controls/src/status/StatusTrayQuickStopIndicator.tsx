/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StatusTrayItem } from "./StatusTrayItem"
import { MachineState, useMachineState } from "@glowbuzzer/store"
import styled from "styled-components"
import { AlertOutlined } from "@ant-design/icons"

const StyledDiv = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    gap: 10px;
    align-items: center;
    color: ${props => props.theme.colorWarning};
    font-size: 20px;
    font-weight: bold;

    > div {
        padding-top: 5px;
    }
`

export const StatusTrayQuickStopIndicator = () => {
    const state = useMachineState()
    if (state !== MachineState.QUICK_STOP) {
        return null
    }
    return (
        <StatusTrayItem id={"quick-stop"}>
            <StyledDiv>
                <AlertOutlined />
                <div>QUICK STOPPED</div>
            </StyledDiv>
        </StatusTrayItem>
    )
}
