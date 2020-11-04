import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../root"

export enum ConnectionState {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED"
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: { state: ConnectionState.DISCONNECTED, error: null },
    reducers: {
        connected: state => ({ ...state, state: ConnectionState.CONNECTED }),
        connecting: state => ({ ...state, state: ConnectionState.CONNECTING, error: null }),
        disconnected: state => ({ ...state, state: ConnectionState.DISCONNECTED }),
        error: (state, action) => ({ ...state, state: ConnectionState.DISCONNECTED, error: action.payload })
    }
})

export const useConnect = () => {
    const { state, error } = useSelector(({ connection: { state, error } }: RootState) => ({ state, error }), shallowEqual)
    const dispatch = useDispatch()

    // window.connection is created in ConnectionFactory.ts

    return {
        state,
        error,
        connected: state === ConnectionState.CONNECTED,
        connect(url) {
            dispatch(window.connection.connect(url))
        },
        disconnect() {
            dispatch(window.connection.disconnect())
        },
        send(msg) {
            dispatch(window.connection.send(msg))
        }
    }
}
