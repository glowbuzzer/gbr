/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { shallowEqual, useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import { MachineMetadata } from "../gbc_extra"
import { configMetadata, useConfig } from "../config"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { useSafetyDigitalOutputState } from "./dout"

function useMachineInputsActive(props: (keyof MachineMetadata)[]) {
    const config = useConfig()
    return useSelector<RootState, boolean[]>(state => {
        const metadata = configMetadata(config.machine[0])
        return props.map(prop => {
            if (!metadata[prop]) {
                return undefined
            }
            const { index, safety } = metadata[prop]
            if (safety) {
                return state.safetyDin[index]?.actValue
            }
            return state.din[index]?.actValue
        })
    }, shallowEqual)
}

export function useMachineInputActive(prop: keyof MachineMetadata) {
    const config = useConfig()
    return useSelector<RootState, boolean>(state => {
        // do the work inside the selector, so react can optimise simple boolean return
        const metadata = configMetadata(config.machine[0])[prop]
        const { index, safety } = metadata || {}

        if (!metadata) {
            return undefined
        }

        if (safety) {
            return state.safetyDin[index]?.actValue
        }

        return state.din[index]?.actValue
    })
}

export function useEstopInput() {
    // inverted
    return !useMachineInputActive("estopStateInput")
}

export function useResetNeededInput() {
    return useMachineInputActive("resetNeededInput")
}

export function useOverallSafetyStateInput() {
    return useMachineInputActive("safetyStateInput")
}

export function useAutoModeActiveInput() {
    return useMachineInputActive("autoModeEnabledInput")
}

export function useEnablingSwitchInput() {
    return useMachineInputActive("motionEnabledInput")
}

export function useSafeStopInput() {
    return useMachineInputActive("safeStopInput") === false
}

export function useSafetyOverrideEnabledInput() {
    return useMachineInputActive("overrideEnabledInput")
}

export function useDrivesSafePositionValidInput() {
    return useMachineInputActive("drivesSafePositionValidInput")
}

type SafeyOverrideProcessRequiredMetadata = Pick<
    MachineMetadata,
    "drivesSafePositionValidInput" | "faultTcpSwmInput" | "faultJointsSlpInput"
>

export function useSafetyOverrideProcessesRequired() {
    const props: (keyof SafeyOverrideProcessRequiredMetadata)[] = [
        "drivesSafePositionValidInput",
        "faultTcpSwmInput",
        "faultJointsSlpInput"
    ]

    const values = useMachineInputsActive(props as any)
    return Object.fromEntries(props.map((prop, i) => [prop, values[i]])) as Record<
        keyof SafeyOverrideProcessRequiredMetadata,
        boolean
    >
}

export function useDrivesSafePositionReset(): (reset: boolean) => void {
    const config = useConfig()
    const safetyOverrideEnabled = useSafetyOverrideEnabledInput()
    const drivesSafePositionValid = useDrivesSafePositionValidInput()
    const { drivesSafePositionResetOutput } = configMetadata(config.machine[0])
    const [{ effectiveValue: resetSent }, setter] = useSafetyDigitalOutputState(
        drivesSafePositionResetOutput?.index || 0
    )

    useEffect(() => {
        if (drivesSafePositionValid && resetSent) {
            // clear reset flag
            console.log("Reset safe position flag")
            setter(false, true)
        }
    }, [safetyOverrideEnabled, drivesSafePositionValid, resetSent, setter])

    return useMemo(() => {
        console.log("drivesSafePositionResetOutput", drivesSafePositionResetOutput)
        if (!drivesSafePositionResetOutput) {
            console.log("no drives safe position reset output")
            return () => {}
        }
        if (!drivesSafePositionResetOutput.safety) {
            console.error("drivesSafePositionResetOutput must be a safety output")
            return () => {}
        }
        return (value: boolean) => setter(value, true)
    }, [drivesSafePositionResetOutput, setter])
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
    const { manualModeBit1Output, manualModeBit2Output } = configMetadata(config.machine[0])
    const bit1 = manualModeBit1Output
    const bit2 = manualModeBit2Output

    const not_configured = !bit1 || !bit2

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
    }, [not_configured, connection, commanded_mode, bit1, bit2])
}
