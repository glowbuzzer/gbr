/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext, useEffect } from "react"
import {
    DesiredState,
    MachineState,
    useConnection,
    useMachineCurrentState,
    useMachineDesiredState,
    useMachineTargetAcquired,
    useSafeStopInput
} from "@glowbuzzer/store"

const autoOpEnabledContext = createContext<boolean>(false)

export const AutoDesiredModeController = ({ children, enabled }) => {
    const connection = useConnection()
    const [, setDesiredState] = useMachineDesiredState()
    const safeStopped = useSafeStopInput()
    const target_acquired = useMachineTargetAcquired()
    const current_state = useMachineCurrentState()

    const connected = connection.connected && connection.statusReceived
    const fault = current_state === MachineState.FAULT
    const fault_active = current_state === MachineState.FAULT_REACTION_ACTIVE
    const disabled = !connected || fault || fault_active || !target_acquired

    useEffect(() => {
        if (!enabled || disabled) {
            return
        }
        if (safeStopped) {
            if (current_state !== MachineState.QUICK_STOP) {
                // go to quickstop
                setDesiredState(DesiredState.QUICKSTOP)
            }
        } else if (current_state !== MachineState.OPERATION_ENABLED) {
            // go to op
            setDesiredState(DesiredState.OPERATIONAL)
        }
    }, [enabled, disabled, safeStopped])

    return <autoOpEnabledContext.Provider value={enabled}>{children}</autoOpEnabledContext.Provider>
}

export function useAutoOpEnabled() {
    return useContext(autoOpEnabledContext)
}
