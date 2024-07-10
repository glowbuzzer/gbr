/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import {
    MachineState,
    ManualMode,
    useAutoModeActiveInput,
    useEnablingSwitchInput,
    useMachineState,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs,
    useOverallSafetyStateInput
} from "@glowbuzzer/store"
import { useGlowbuzzerMode } from "../modes"

type HandGuidedModeState = {
    handGuidedModeSupported: boolean
    handGuidedModeRequested: boolean
    handGuidedModeActive: boolean
    overallSafetyState: boolean
    enablingSwitchEngaged: boolean
}

export function useHandGuidedMode(): HandGuidedModeState {
    const { mode, modes } = useGlowbuzzerMode()

    const handGuidedModeSupported = modes.some(m => m.value === ManualMode.HAND_GUIDED)
    const overallSafetyState = useOverallSafetyStateInput()
    const enablingSwitchEngaged = useEnablingSwitchInput()
    const manualMode = !useAutoModeActiveInput()
    const machineState = useMachineState()

    const handGuidedModeRequested = mode === ManualMode.HAND_GUIDED

    const handGuidedModeActive =
        machineState === MachineState.OPERATION_ENABLED &&
        overallSafetyState &&
        manualMode &&
        enablingSwitchEngaged

    return useMemo(() => {
        return {
            handGuidedModeActive,
            handGuidedModeSupported,
            overallSafetyState,
            handGuidedModeRequested,
            enablingSwitchEngaged
        }
    }, [
        handGuidedModeActive,
        handGuidedModeSupported,
        overallSafetyState,
        handGuidedModeRequested,
        enablingSwitchEngaged
    ])
}
