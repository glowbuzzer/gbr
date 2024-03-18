/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import {
    DIN_SAFETY_TYPE,
    MachineState,
    useMachineState,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs
} from "@glowbuzzer/store"

type HandGuidedModeState = {
    handGuidedModeSupported: boolean
    handGuidedModeActive: boolean
    overallSafetyState: boolean
    keyswitchEngaged: boolean
    deadmanEngaged: boolean
}

export function useHandGuidedMode(): HandGuidedModeState {
    const digitalInputList = useSafetyDigitalInputList()
    const machineState = useMachineState()
    const inputs = useSafetyDigitalInputs()

    const { supported, ...indexes } = useMemo(() => {
        const overallStateIndex = digitalInputList.findIndex(
            c => c.type === DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_OVERALL_STATE
        )
        const keyswitchIndex = digitalInputList.findIndex(
            c => c.type === DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_KEYSWITCH
        )
        const deadmanIndex = digitalInputList.findIndex(
            c => c.type === DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_DEAD_MAN
        )
        const supported = keyswitchIndex !== -1

        return { supported, overallStateIndex, keyswitchIndex, deadmanIndex }
    }, [digitalInputList])

    return useMemo(() => {
        const overallState = inputs[indexes.overallStateIndex]
        const keyswitch = inputs[indexes.keyswitchIndex]
        const deadman = inputs[indexes.deadmanIndex]
        const active =
            machineState === MachineState.OPERATION_ENABLED && overallState && keyswitch && deadman

        return {
            handGuidedModeActive: active,
            handGuidedModeSupported: supported,
            overallSafetyState: overallState,
            keyswitchEngaged: keyswitch,
            deadmanEngaged: deadman
        }
    }, [machineState, inputs, indexes])
}
