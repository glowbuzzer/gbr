/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useContext, useEffect } from "react"
import {
    MachineState,
    SERIAL_CONTROL_WORD,
    SERIAL_STATUS_WORD,
    useConnection,
    useMachineState,
    useSerialCommunication,
    useSerialCommunicationEffect
} from "@glowbuzzer/store"

const SerialCommunicationsContext = React.createContext<boolean>(null)

enum InitState {
    NONE,
    INIT,
    READY
}

export const SerialCommunicationsProvider = ({ children }) => {
    const [initState, setInitState] = React.useState(InitState.NONE)
    const { connected } = useConnection()
    const machineState = useMachineState()
    const { sendControlWord } = useSerialCommunication()

    useEffect(() => {
        if (connected && machineState === MachineState.OPERATION_ENABLED) {
            if (initState === InitState.NONE) {
                console.log("SEND SERIAL INIT REQUEST")
                setInitState(InitState.INIT)
                sendControlWord(1 << SERIAL_CONTROL_WORD.SERIAL_INIT_REQUEST_BIT_NUM)
            }
        } else {
            setInitState(InitState.NONE)
        }
    }, [connected, machineState])

    useSerialCommunicationEffect(status => {
        if (status.statusWord & (1 << SERIAL_STATUS_WORD.SERIAL_INIT_ACCEPTED_BIT_NUM)) {
            console.log("SERIAL INIT ACCEPTED")
            setInitState(InitState.READY)
            sendControlWord(0) // unset the init request bit
        }
    }, false)

    useSerialCommunicationEffect(status => {
        if (
            (status.statusWord & (1 << SERIAL_STATUS_WORD.SERIAL_RECEIVE_REQUEST_BIT_NUM)) !==
            (status.controlWord & (1 << SERIAL_CONTROL_WORD.SERIAL_RECEIVE_ACCEPTED_BIT_NUM))
        ) {
            console.log("SYNC SERIAL RECEIVE REQUEST")
            const controlWord =
                status.controlWord ^ (1 << SERIAL_CONTROL_WORD.SERIAL_RECEIVE_ACCEPTED_BIT_NUM)

            sendControlWord(controlWord)
        }
    })

    return (
        <SerialCommunicationsContext.Provider value={initState === InitState.READY}>
            {children}
        </SerialCommunicationsContext.Provider>
    )
}

export function useSerialCommunicationReadyState() {
    const context = useContext(SerialCommunicationsContext)
    if (context === null) {
        throw new Error(
            "useSerialCommunicationsReadyState must be used within a SerialCommunicationsProvider"
        )
    }
    return context
}
