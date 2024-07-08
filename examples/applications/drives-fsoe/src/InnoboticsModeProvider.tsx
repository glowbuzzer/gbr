/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import { GlowbuzzerModeContextType, GlowbuzzerModeProvider } from "@glowbuzzer/controls"
import { ManualMode, useAutoModeActiveInput, useManualMode } from "@glowbuzzer/store"

export const InnoboticsModeProvider = ({ children }) => {
    const autoModeEnabled = useAutoModeActiveInput()
    const [manualMode, setManualMode] = useManualMode()

    useEffect(() => {
        // whenever we switch between auto/manual, ensure we revert to disabled mode
        // (applies equally to auto and manual mode, even though this doesn't affect auto mode)
        setManualMode(ManualMode.DISABLED)
    }, [autoModeEnabled])

    function setMode(mode: ManualMode | "auto") {
        if (mode === "auto") {
            setManualMode(ManualMode.DISABLED)
        } else {
            setManualMode(mode)
        }
    }

    const mode = autoModeEnabled ? "auto" : manualMode

    const context: GlowbuzzerModeContextType = {
        mode,
        setMode,
        modes: [
            {
                value: "auto",
                name: "Auto",
                disabled: !autoModeEnabled
            },
            {
                value: ManualMode.DISABLED,
                name: "Disabled",
                disabled: autoModeEnabled
            },
            {
                value: ManualMode.JOG,
                name: "Jog",
                disabled: autoModeEnabled
            },
            {
                value: ManualMode.TEST_PROGRAM,
                name: "Test Program",
                disabled: autoModeEnabled
            },
            {
                value: ManualMode.HAND_GUIDED,
                name: "Hand Guided",
                disabled: autoModeEnabled
            }
        ]
    }

    return <GlowbuzzerModeProvider context={context}>{children}</GlowbuzzerModeProvider>
}
