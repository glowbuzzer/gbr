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

export const useConnect = () => {
    const { state, error, autoConnect, statusReceived } = useSelector(
        ({ connection }: RootState) => connection,
        shallowEqual
    )
    const dispatch = useDispatch()
    const prefs = usePrefs()

    // window.connection is created in ConnectionFactory.ts

    return useMemo(() => {
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
    }, [state, error, autoConnect, dispatch, prefs, statusReceived])
}
