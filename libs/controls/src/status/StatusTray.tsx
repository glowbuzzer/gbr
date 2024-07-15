/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { useStatusTrayVisible } from "./StatusTrayProvider"
import { StatusTrayModifiedConfiguration } from "./StatusTrayModifiedConfiguration"
import { StatusTrayFaults } from "./StatusTrayFaults"
import { StatusTrayGbcVersionCheck } from "./StatusTrayGbcVersionCheck"
import { StatusTrayModeSwitch } from "./StatusTrayModeSwitch"
import { StatusTrayConnect } from "./StatusTrayConnect"
import { useEffect, useState } from "react"
import { StatusTraySafetyErrors } from "./StatusTraySafetyErrors"
import { StatusTraySafetyOverrideMode } from "./StatusTraySafetyOverrideMode"

const StyledDiv = styled.div<{ $visible: boolean; $bottomOffset: number }>`
    position: absolute;
    bottom: ${props => `calc(100vh - ${props.$bottomOffset}px + 4px)`};
    // top: ${props => `${props.$bottomOffset}px`};
    //bottom: 40px;
    left: 0;
    width: 100vw;
    pointer-events: none;
    display: ${props => (props.$visible ? "block" : "none")};

    .tray {
        z-index: 1000;
        pointer-events: all;
        width: 50%;
        min-width: 500px;
        margin: 0 auto;
        height: 100%;
        border: 3px solid ${props => props.theme.colorWarningBorder};
        background: ${props => props.theme.colorBgContainer};
        border-radius: 14px;
        box-shadow: 0 0 15px 3px ${props => props.theme.colorWarningBorder}; /* Glow effect */
    }
`

type StatusTrayProps = {
    statusBarRef: React.RefObject<HTMLDivElement>
}

/**
 * Status tray at the bottom of the screen, which will appear if there are any notifications active
 */
export const StatusTray = ({ statusBarRef }: StatusTrayProps) => {
    const visible = useStatusTrayVisible()
    const [bottomOffset, setBottomOffset] = useState(0)

    useEffect(() => {
        if (statusBarRef.current) {
            function handle_resize(entries: ResizeObserverEntry[]) {
                const entry = entries[0]
                if (entry) {
                    const rect = entry.target.getBoundingClientRect()
                    setBottomOffset(rect.top)
                }
            }

            const observer = new ResizeObserver(handle_resize)
            observer.observe(statusBarRef.current)
            return () => {
                observer.disconnect()
            }
        }
    }, [statusBarRef])

    return (
        <StyledDiv $visible={visible} $bottomOffset={bottomOffset}>
            <div className="tray">
                <StatusTraySafetyErrors />
                <StatusTraySafetyOverrideMode />
                <StatusTrayConnect />
                <StatusTrayModeSwitch />
                <StatusTrayModifiedConfiguration />
                <StatusTrayFaults />
                <StatusTrayGbcVersionCheck />
            </div>
        </StyledDiv>
    )
}
