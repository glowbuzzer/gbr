/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { SERIAL_CONTROL_WORD, SERIAL_STATUS_WORD, SerialCommand, SerialStatus } from "../gbc"
import { useConfig } from "../config"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { MachineState, useConnection, useMachineState } from "@glowbuzzer/store"

type SerialSliceState = SerialStatus & {
    controlWord: number
}

export const serialSlice: Slice<
    SerialSliceState,
    {
        status: CaseReducer<SerialSliceState, PayloadAction<SerialStatus>>
        setControlWord: CaseReducer<SerialSliceState, PayloadAction<number>>
    }
> = createSlice({
    name: "serial",
    initialState: {
        statusWord: 0,
        controlWord: 0,
        length: 0,
        data: []
    } as SerialSliceState,
    reducers: {
        status(state, action) {
            return { controlWord: state.controlWord, ...action.payload }
        },
        setControlWord(state, action: PayloadAction<number>) {
            return {
                ...state,
                controlWord: action.payload
            }
        }
    }
})

/**
 * Low level hook to trigger a callback whenever the serial status changes, and optionally the control word that has been sent
 *
 * @param callback Function to call with complete serial status when the status word or control word changes
 * @param ignoreControlWord If true, the callback will only be called when the status word changes
 */
export function useSerialCommunicationEffect(
    callback: (status: SerialSliceState) => void,
    ignoreControlWord = false
) {
    const { connected } = useConnection()
    const machineState = useMachineState()

    const status = useSelector(
        (state: RootState) => state.serial,
        // the data can only change when the status word changes (tx/rx bit change), or (optionally) the control word we've sent
        (a, b) =>
            a.statusWord === b.statusWord && (ignoreControlWord || a.controlWord === b.controlWord)
    )

    useEffect(() => {
        if (connected && machineState === MachineState.OPERATION_ENABLED) {
            callback(status)
        }
    }, [status, connected, machineState])
}

/**
 * Hook that will trigger a callback whenever new data is received.
 *
 * @param callback Function to call with the received data and length
 */
export function useSerialCommunicationReceive(callback: (data: number[], length: number) => void) {
    const status = useSelector(
        (root: RootState) => root.serial,
        // the data can only change when the status word changes (tx/rx bit change)
        (a, b) => a.statusWord === b.statusWord && a.controlWord === b.controlWord
    )

    useEffect(() => {
        // called whenever the control or status words change
        const send = status.controlWord & (1 << SERIAL_CONTROL_WORD.SERIAL_RECEIVE_ACCEPTED_BIT_NUM)
        const recv = status.statusWord & (1 << SERIAL_STATUS_WORD.SERIAL_RECEIVE_REQUEST_BIT_NUM)
        if (send !== recv) {
            // we have an outstanding receive (SerialCommunicationProvider will do the ack)
            callback(status.data, status.length)
        }
    }, [status])
}

/**
 * Hook to send control words and data over the serial connection
 */
export function useSerialCommunication(): {
    sendData(data: number[]): void
    sendControlWord: (controlWord: number) => void
} {
    const config = useConfig()
    const { send, connected } = useConnection()
    const status = useSelector((state: RootState) => state.serial.statusWord)
    const dispatch = useDispatch()

    if (!config.serial?.length) {
        return {
            sendControlWord() {
                throw new Error("Serial communication not configured")
            },
            sendData() {
                throw new Error("Serial communication not configured")
            }
        }
    }

    return useMemo(() => {
        return {
            sendControlWord: (controlWord: number) => {
                if (!connected) {
                    throw new Error("Not connected, serial communication not possible")
                }
                send(
                    JSON.stringify({
                        command: {
                            serial: {
                                [0]: {
                                    command: {
                                        controlWord
                                    } as SerialCommand
                                }
                            }
                        }
                    })
                )
                dispatch(serialSlice.actions.setControlWord(controlWord))
            },
            sendData(data: number[]) {
                // xor the transmit bit of the current status
                const controlWord =
                    status ^ (1 << SERIAL_CONTROL_WORD.SERIAL_TRANSMIT_REQUEST_BIT_NUM)

                if (!connected) {
                    throw new Error("Not connected, serial communication not possible")
                }
                send(
                    JSON.stringify({
                        command: {
                            serial: {
                                [0]: {
                                    command: {
                                        controlWord,
                                        length: data.length,
                                        data
                                    } as SerialCommand
                                }
                            }
                        }
                    })
                )
                dispatch(serialSlice.actions.setControlWord(controlWord))
            }
        }
    }, [send, connected, status, dispatch])
}