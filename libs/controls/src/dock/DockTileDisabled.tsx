/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StyledDockTileDimmer } from "./styles"
import { useGlowbuzzerTheme } from "../app"
import { DisabledContextProvider } from "antd/es/config-provider/DisabledContext"

type DockTileDisabledProps = {
    children?: React.ReactNode
    content?: React.ReactNode
    disabledOnly?: boolean
}

export const DockTileDisabled = ({
    children = null,
    content = null,
    disabledOnly
}: DockTileDisabledProps) => {
    const { darkMode } = useGlowbuzzerTheme()

    if (disabledOnly && content) {
        console.warn("DockTileDisabled: content is ignored when disabledOnly is true")
    }

    if (disabledOnly) {
        return <DisabledContextProvider disabled={true}>{children}</DisabledContextProvider>
    }

    return (
        <DisabledContextProvider disabled={true}>
            {children}
            <StyledDockTileDimmer $darkMode={darkMode}>
                {content && <div className="content">{content}</div>}
            </StyledDockTileDimmer>
        </DisabledContextProvider>
    )
}
