/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, ReactNode, useContext } from "react"
import { DisabledContextProvider } from "antd/es/config-provider/DisabledContext"
import { useGlowbuzzerTheme } from "../app"
import styled from "styled-components"

function gradient(darkMode: boolean) {
    const color1 = darkMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
    const color2 = darkMode ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.2)"
    return `linear-gradient(
        135deg,
        ${color2} 5%,
        ${color1} 5%,
        ${color1} 50%,
        ${color2} 50%,
        ${color2} 55%,
        ${color1} 55%,
        ${color1} 100%
    )`
}

const StyledDockTileDimmer = styled.div<{ $darkMode: boolean; $blur: boolean }>`
    position: relative;
    height: 100%;
    overflow: hidden;

    .overlay {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-image: ${props => gradient(props.$darkMode)};
        background-size: 6px 6px;
        display: flex;
        justify-content: center;
        align-items: center;

        .content {
            padding: 20px 30px;
            border-radius: 10px;
            border: 1px solid ${props => props.theme.colorBorder};
            background: ${props => props.theme.colorBgContainer};
        }
    }
`

export const DockTileDisabledContext = createContext<{ active: boolean; blurred: boolean }>({
    active: false,
    blurred: false
})

const BLUR = "2px"

export const DockTileDisabledWithNestedSupport = ({
    children,
    disabled,
    blur,
    content
}: {
    children: ReactNode
    disabled: boolean
    blur?: boolean
    content?: ReactNode
}) => {
    const { darkMode } = useGlowbuzzerTheme()
    const { active, blurred } = useContext(DockTileDisabledContext)

    if (!disabled) {
        return children
    }

    if (active) {
        // overlay already in place, don't display twice, but blur if not already blurred
        if (blur && !blurred) {
            return (
                <DockTileDisabledContext.Provider value={{ active: true, blurred: true }}>
                    <div style={{ filter: `blur(${BLUR})` }}>{children}</div>
                </DockTileDisabledContext.Provider>
            )
        }
        return children
    }

    // disabled is true, display overlay
    return (
        <DockTileDisabledContext.Provider value={{ active: true, blurred: blur }}>
            <DisabledContextProvider disabled={true}>
                <StyledDockTileDimmer $darkMode={darkMode} $blur={blur}>
                    <div
                        className="main-content"
                        style={{ filter: blur ? `blur(${BLUR})` : undefined, height: "100%" }}
                    >
                        {children}
                    </div>
                    <div className="overlay">
                        {content && <div className="content">{content}</div>}
                    </div>
                </StyledDockTileDimmer>
            </DisabledContextProvider>
        </DockTileDisabledContext.Provider>
    )
}
