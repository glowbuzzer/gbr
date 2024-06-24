/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext, useEffect } from "react"
import { DesiredState, MachineState, useConnection, useEstop, useMachine } from "@glowbuzzer/store"

const autoOpEnabledContext = createContext<boolean>(false)

export const AutoOpEnabledController = ({ children, enabled }) => {
    const connection = useConnection()
    const machine = useMachine()
    const connected = connection.connected && connection.statusReceived
    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget

    const disabled =
        !connected ||
        fault ||
        fault_active ||
        target_not_acquired ||
        machine.desiredState === DesiredState.OPERATIONAL

    useEffect(() => {
        if (enabled && !disabled) {
            machine.setDesiredState(DesiredState.OPERATIONAL)
        }
    }, [enabled, disabled])

    return <autoOpEnabledContext.Provider value={enabled}>{children}</autoOpEnabledContext.Provider>
}

export function useAutoOpEnabled() {
    return useContext(autoOpEnabledContext)
}
