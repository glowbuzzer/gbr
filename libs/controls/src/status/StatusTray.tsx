/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { useStatusTrayVisible } from "./StatusTrayProvider"
import { StatusTrayModifiedConfiguration } from "./StatusTrayModifiedConfiguration"
import { StatusTrayFaults } from "./StatusTrayFaults"
import { StatusTrayGbcVersionCheck } from "./StatusTrayGbcVersionCheck"

const StyledDiv = styled.div<{ $visible: boolean }>`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw;
    pointer-events: none;
    display: ${props => (props.$visible ? "block" : "none")};

    .tray {
        z-index: 1000;
        pointer-events: all;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        width: 50%;
        min-width: 500px;
        margin: 0 auto;
        height: 100%;
        border: 2px solid ${props => props.theme.colorBorder};
        // add fuzzy border outside
        box-shadow: 0 0 10px 10px ${props => props.theme.yellow4};
        border-bottom: none;
        background: ${props => props.theme.yellow4};
    }
`

/**
 * Status tray at the bottom of the screen, which will appear if there are any notifications active
 */
export const StatusTray = () => {
    const visible = useStatusTrayVisible()

    return (
        <StyledDiv $visible={visible}>
            <div className="tray">
                <StatusTrayModifiedConfiguration />
                <StatusTrayFaults />
                <StatusTrayGbcVersionCheck />
            </div>
        </StyledDiv>
    )
}
