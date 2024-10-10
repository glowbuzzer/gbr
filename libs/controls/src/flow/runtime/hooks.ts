/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    STREAMSTATE,
    useAnalogInputs,
    useDigitalInputs,
    useExternalIntegerInputs,
    useExternalUnsignedIntegerInputs,
    useIntegerInputs,
    useMachineHeartbeat,
    useSafetyDigitalInputs,
    useUnsignedIntegerInputs
} from "@glowbuzzer/store"
import { useEffect, useMemo } from "react"
import { FlowState, MachineInputsState } from "./types"

export function useFlowTriggerInputsState(): MachineInputsState {
    const digitalInputs = useDigitalInputs()
    const safetyDigitalInputs = useSafetyDigitalInputs()
    const analogInputs = useAnalogInputs()
    const integerInputs = useIntegerInputs()
    const unsignedIntegerInputs = useUnsignedIntegerInputs()
    const externalIntegerInputs = useExternalIntegerInputs()
    const externalUnsignedIntegerInputs = useExternalUnsignedIntegerInputs()
    const heartbeat = useMachineHeartbeat()

    return useMemo(
        () => ({
            analogInputs,
            digitalInputs,
            safetyDigitalInputs,
            integerInputs,
            unsignedIntegerInputs,
            externalIntegerInputs,
            externalUnsignedIntegerInputs,
            heartbeat
        }),
        [
            analogInputs,
            digitalInputs,
            safetyDigitalInputs,
            integerInputs,
            unsignedIntegerInputs,
            externalIntegerInputs,
            externalUnsignedIntegerInputs,
            heartbeat
        ]
    )
}

export function useFlowDerivedState(
    connected: boolean,
    state: STREAMSTATE,
    triggerNextFlow: boolean,
    triggersPaused: boolean,
    error: boolean
) {
    if (!connected) {
        return FlowState.OFFLINE
    }
    if (error) {
        return FlowState.ERROR
    }
    // merge stream state with wait state betwen flows (client-side triggers)
    switch (state) {
        case STREAMSTATE.STREAMSTATE_IDLE:
            return triggerNextFlow
                ? triggersPaused
                    ? FlowState.PAUSED
                    : FlowState.WAITING_ON_TRIGGER
                : FlowState.IDLE
        case STREAMSTATE.STREAMSTATE_ACTIVE:
            return FlowState.ACTIVE
        case STREAMSTATE.STREAMSTATE_PAUSED:
            return FlowState.PAUSED
        case STREAMSTATE.STREAMSTATE_STOPPING:
            return FlowState.STOPPING
        case STREAMSTATE.STREAMSTATE_STOPPED:
            return FlowState.STOPPED
        default:
            return FlowState.OFFLINE
    }
}
