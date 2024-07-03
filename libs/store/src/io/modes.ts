/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { MachineConfig, RootState, useConfig, useConnection } from "@glowbuzzer/store"
import { useSelector } from "react-redux"
import { useMemo } from "react"

function useInputActive(
    prop: Extract<
        keyof MachineConfig,
        "autoModeEnabledInput" | "motionEnabledInput" | "safeStopInput"
    >
) {
    const config = useConfig()
    return useSelector<RootState, boolean>(state => {
        // do the work inside the selector, so react can optimise simple boolean return
        const { enabled, index, safety } = config.machine[0][prop] || {}
        if (!enabled) {
            return false
        }

        if (safety) {
            return state.safetyDin[index]?.actValue
        }

        return state.din[index]?.actValue
    })
}

export function useAutoModeActiveInput() {
    return useInputActive("autoModeEnabledInput")
}

export function useMotionEnabledInput() {
    return useInputActive("motionEnabledInput")
}

export function useSafeStopInput() {
    return useInputActive("safeStopInput")
}

export enum ManualMode {
    DISABLED = 0b00,
    JOG = 0b01,
    TEST_PROGRAM = 0b10,
    HAND_GUIDED = 0b11
}

export function useManualMode(): [ManualMode, (mode: ManualMode) => void] {
    const connection = useConnection()
    const config = useConfig()
    const bit1 = config.machine[0].manualModeBit1Output
    const bit2 = config.machine[0].manualModeBit2Output

    const not_configured = !bit1?.enabled || !bit2?.enabled

    const commanded_mode = useSelector<RootState, ManualMode>(state => {
        if (not_configured) {
            return ManualMode.DISABLED
        }
        if (bit1.safety !== bit2.safety) {
            // can't think why this would ever happen!
            console.warn("Manual mode bits are not in the same safety group")
        }
        const outputs = bit1.safety ? state.safetyDout : state.dout
        const active1 = outputs[bit1.index]?.effectiveValue ? 1 : 0
        const active2 = outputs[bit2.index]?.effectiveValue ? 1 : 0
        return active1 | (active2 << 1)
    })

    return useMemo(() => {
        if (not_configured) {
            return [ManualMode.DISABLED, () => {}]
        }

        const command_key = bit1.safety ? "safetyDout" : "dout"

        return [
            commanded_mode,
            (mode: ManualMode) => {
                const bit1_value = !!(mode & 1)
                const bit2_value = !!(mode >> 1)

                connection.send(
                    JSON.stringify({
                        command: {
                            [command_key]: {
                                [bit1.index]: {
                                    command: {
                                        override: true,
                                        setValue: bit1_value
                                    }
                                },
                                [bit2.index]: {
                                    command: {
                                        override: true,
                                        setValue: bit2_value
                                    }
                                }
                            }
                        }
                    })
                )
            }
        ]
    }, [not_configured, connection, commanded_mode])
}
