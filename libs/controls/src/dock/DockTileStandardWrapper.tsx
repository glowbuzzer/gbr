/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useConnection } from "@glowbuzzer/store"
import { useOperationEnabled } from "../util"
import { DockTileDisabledWithNestedSupport } from "./DockTileDisabledWithNestedSupport"

export const DockTileStandardWrapper = ({ children, requireOpEnabled }) => {
    const { connected } = useConnection()
    const op = useOperationEnabled()

    const disabled = !connected || (requireOpEnabled && !op)
    return (
        <DockTileDisabledWithNestedSupport disabled={disabled}>
            {children}
        </DockTileDisabledWithNestedSupport>
    )
}
