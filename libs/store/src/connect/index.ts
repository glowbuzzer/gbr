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
        lastStatus: null as Date,
        autoConnect: true
    },
    reducers: {
        connected: state => ({ ...state, state: ConnectionState.CONNECTED }),
        connecting: state => ({ ...state, state: ConnectionState.CONNECTING, error: null }),
        disconnected: state => ({ ...state, state: ConnectionState.DISCONNECTED }),
        autoConnect: (state, action) => ({ ...state, autoConnect: action.payload }),
        error: (state, action) => ({ ...state, state: ConnectionState.DISCONNECTED, error: action.payload }),
        ping: state => ({ ...state, lastStatus: new Date() })
    }
})

export const useConnect = () => {
    const { state, error, autoConnect } = useSelector(
        ({ connection: { state, error, autoConnect } }: RootState) => ({ state, error, autoConnect }),
        shallowEqual
    )
    const dispatch = useDispatch()
    const prefs = usePrefs()

    // window.connection is created in ConnectionFactory.ts

    return {
        state,
        error,
        autoConnect,
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
