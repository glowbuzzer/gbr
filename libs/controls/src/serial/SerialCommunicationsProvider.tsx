/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useEffect } from "react"
import {
    MachineState,
    RootState,
    SERIAL_CONTROL_WORD,
    SERIAL_STATUS_WORD,
    serialSlice,
    useConnection,
    useMachineState,
    useSerialCommunication,
    useSerialCommunicationEffect
} from "@glowbuzzer/store"
import { useDispatch, useSelector } from "react-redux"

export const SerialCommunicationsProvider = ({ children = null }) => {
    const { connected } = useConnection()
    const machineState = useMachineState()
    const { sendControlWord } = useSerialCommunication()
    const dispatch = useDispatch()
    const init_done = useSelector((state: RootState) => state.serial.initialized)

    useEffect(() => {
        if (connected && machineState === MachineState.OPERATION_ENABLED && !init_done) {
            console.log("SEND SERIAL INIT REQUEST")
            sendControlWord(1 << SERIAL_CONTROL_WORD.SERIAL_INIT_REQUEST_BIT_NUM)
        } else {
            dispatch(serialSlice.actions.init(false))
        }
    }, [connected, machineState])

    useSerialCommunicationEffect(status => {
        if (
            // !init_done &&
            status.statusWord &
            (1 << SERIAL_STATUS_WORD.SERIAL_INIT_ACCEPTED_BIT_NUM)
        ) {
            console.log("SERIAL INIT ACCEPTED")
            dispatch(serialSlice.actions.init(true))
            sendControlWord(0) // unset the init request bit
        }
    })

    useSerialCommunicationEffect(status => {
        const recv = status.statusWord & (1 << SERIAL_STATUS_WORD.SERIAL_RECEIVE_REQUEST_BIT_NUM)
        const recv_ack =
            status.controlWord & (1 << SERIAL_CONTROL_WORD.SERIAL_RECEIVE_ACCEPTED_BIT_NUM)

        if (recv !== recv_ack) {
            const controlWord =
                status.controlWord ^ (1 << SERIAL_CONTROL_WORD.SERIAL_RECEIVE_ACCEPTED_BIT_NUM)

            console.log("SET CONTROL WORD", controlWord)
            sendControlWord(controlWord)
        }
    })

    return children
}
