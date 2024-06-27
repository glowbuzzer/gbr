/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useConnection } from "@glowbuzzer/store"
import { useOperationEnabled } from "../util"
import { DockTileDisabled } from "./DockTileDisabled"

export const DockTileStandardWrapper = ({ children, requireOpEnabled }) => {
    const { connected } = useConnection()
    const op = useOperationEnabled()

    if (!connected || (requireOpEnabled && !op)) {
        return <DockTileDisabled children={children} />
    }

    return <>{children}</>
}
