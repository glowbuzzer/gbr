/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    ManualMode,
    useAutoModeActiveInput,
    useConnection,
    useMotionEnabledInput
} from "@glowbuzzer/store"
import { DockTileDisabled, useGlowbuzzerMode, useOperationEnabled } from "@glowbuzzer/controls"

function get_message(op: boolean, autoMode: boolean, mode: ManualMode, deadman: boolean) {
    if (!op) {
        return "Operation Not Enabled"
    }
    if (autoMode) {
        return "Manual Mode Not Selected"
    }
    if (mode !== ManualMode.JOG) {
        return "Jog Mode Not Selected"
    }
    if (!deadman) {
        return "Deadman Not Engaged"
    }
}

export const InnoboticsJogTileWrapper = ({ children }) => {
    const autoMode = useAutoModeActiveInput()
    const motionAllowed = useMotionEnabledInput()
    const { connected } = useConnection()
    const op = useOperationEnabled()
    const { mode } = useGlowbuzzerMode()

    if (!connected) {
        return <DockTileDisabled children={children} />
    }

    const message = get_message(op, autoMode, mode as ManualMode, motionAllowed)
    if (message) {
        return <DockTileDisabled children={children} content={message} />
    }

    return <>{children}</>
}
