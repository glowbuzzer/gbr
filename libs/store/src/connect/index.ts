import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { RootState } from "../root"
import { usePrefs } from "../prefs"
import { useMemo } from "react"

export enum ConnectionState {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED"
}

type ConnectionSliceType = {
    state: ConnectionState
    error: unknown
    autoConnect: boolean
    statusReceived: boolean
}

export const connectionSlice: Slice<
    ConnectionSliceType,
    {
        connected: CaseReducer<ConnectionSliceType>
        connecting: CaseReducer<ConnectionSliceType>
        disconnected: CaseReducer<ConnectionSliceType>
        autoConnect: CaseReducer<ConnectionSliceType, PayloadAction<boolean>>
        error: CaseReducer<ConnectionSliceType, PayloadAction<unknown>>
        statusReceived: CaseReducer<ConnectionSliceType, PayloadAction<boolean>>
    }
> = createSlice({
    name: "connection",
    initialState: {
        state: ConnectionState.DISCONNECTED as ConnectionState,
        error: null,
        autoConnect: true,
        statusReceived: true // assume all okay at start
    } as ConnectionSliceType,
    reducers: {
        connected: state => ({ ...state, state: ConnectionState.CONNECTED }),
        connecting: state => {
            state.state = ConnectionState.CONNECTING
            state.statusReceived = true
            state.error = null
        },
        disconnected: state => ({ ...state, state: ConnectionState.DISCONNECTED }),
        autoConnect: (state, action) => ({ ...state, autoConnect: action.payload }),
        error: (state, action) => ({
            ...state,
            state: ConnectionState.DISCONNECTED,
            error: action.payload
        }),
        statusReceived: (state, action) => {
            state.statusReceived = action.payload
        }
    }
})

/**
 * Returns an object containing the current connection state and methods to interact with GBC.
 */
export const useConnection = (): {
    /** Current state of the connection */
    state: ConnectionState
    /** @ignore **/
    error: unknown
    /** Indicates connection should be re-established automatically after unexpected disconnect */
    autoConnect: boolean
    /** Indicates status is being received in a timely manner (heartbeat) */
    statusReceived: boolean
    /** Indicates connection is established */
    connected: boolean
    /** Connect to url */
    connect(url: string): void
    /** Close connection and reconnect */
    reconnect(): void
    /** Disconnect */
    disconnect(): void
    /** Send a message over websocket. See GBC schema docs for format */
    send(message: any): void
    /** Set whether connection should be re-established automatically after unexpected disconnects */
    setAutoConnect(value: boolean): void
} => {
    const { state, error, autoConnect, statusReceived } = useSelector(
        ({ connection }: RootState) => connection,
        shallowEqual
    )
    const dispatch = useDispatch()
    const prefs = usePrefs()

    // window.connection is created in ConnectionFactory.ts

    return useMemo(
        () => ({
            state,
            error,
            autoConnect,
            statusReceived,
            connected: state === ConnectionState.CONNECTED,
            connect(url) {
                dispatch(window.connection.connect(url))
                dispatch(connectionSlice.actions.autoConnect(true))
            },
            reconnect() {
                dispatch(window.connection.connect(prefs.current.url))
            },
            disconnect() {
                dispatch(window.connection.disconnect())
            },
            send(msg) {
                dispatch(window.connection.send(msg))
            },
            setAutoConnect(value: boolean) {
                dispatch(connectionSlice.actions.autoConnect(value))
            }
        }),
        [state, error, autoConnect, dispatch, prefs, statusReceived]
    )
}
