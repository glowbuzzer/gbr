import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../root"
import { usePrefs } from "../prefs"

export enum ConnectionState {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED"
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: {
        state: ConnectionState.DISCONNECTED,
        error: null,
        autoConnect: true,
        statusReceived: true // assume all okay at start
    },
    reducers: {
        connected: state => ({ ...state, state: ConnectionState.CONNECTED }),
        connecting: state => {
            state.state = ConnectionState.CONNECTING
            state.statusReceived = true
            state.error = null
        },
        disconnected: state => ({ ...state, state: ConnectionState.DISCONNECTED }),
        autoConnect: (state, action) => ({ ...state, autoConnect: action.payload }),
        error: (state, action) => ({ ...state, state: ConnectionState.DISCONNECTED, error: action.payload }),
        statusReceived: (state, action) => {
            state.statusReceived = action.payload
        }
    }
})

export const useConnect = () => {
    const { state, error, autoConnect, statusReceived } = useSelector(({ connection }: RootState) => connection, shallowEqual)
    const dispatch = useDispatch()
    const prefs = usePrefs()

    // window.connection is created in ConnectionFactory.ts

    return {
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
    }
}
