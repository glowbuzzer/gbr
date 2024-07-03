/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext, useEffect } from "react"
import {
    DesiredState,
    MachineState,
    useConnection,
    useMachine,
    useSafeStopInput
} from "@glowbuzzer/store"

const autoOpEnabledContext = createContext<boolean>(false)

export const AutoDesiredModeController = ({ children, enabled }) => {
    const connection = useConnection()
    const machine = useMachine()
    const safeStopped = useSafeStopInput()
    const connected = connection.connected && connection.statusReceived
    const current_state = machine.currentState
    const fault = current_state === MachineState.FAULT
    const fault_active = current_state === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget

    const disabled = !connected || fault || fault_active || target_not_acquired

    useEffect(() => {
        if (!enabled || disabled) {
            return
        }
        if (safeStopped) {
            if (current_state !== MachineState.QUICK_STOP) {
                // go to quickstop
                machine.setDesiredState(DesiredState.QUICKSTOP)
            }
        } else if (current_state !== MachineState.OPERATION_ENABLED) {
            // go to op
            machine.setDesiredState(DesiredState.OPERATIONAL)
        }
    }, [enabled, disabled, machine.desiredState, safeStopped])

    return <autoOpEnabledContext.Provider value={enabled}>{children}</autoOpEnabledContext.Provider>
}

export function useAutoOpEnabled() {
    return useContext(autoOpEnabledContext)
}
