import * as React from "react"
import { FC, useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { configureStore, StoreEnhancer } from "@reduxjs/toolkit"
import {
    ConfigState,
    ConnectionState,
    rootReducer,
    useConfigState,
    useConnection
} from "@glowbuzzer/store"
import styled, { css, ThemeProvider } from "styled-components"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"

const theme = {
    colors: {
        border: "#cccccc"
    }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare module "styled-components" {
    type Theme = typeof theme

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}

const GlowbuzzerDimmerStyle = styled.div<{ visible: boolean }>`
    display: none;

    ${props =>
        props.visible &&
        css`
            display: block;
            position: fixed;
            z-index: 300;
            background-color: rgba(1, 1, 1, 0.7);
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
        `}
    .reconnect-panel {
        position: fixed;
        text-align: center;
        z-index: 301;
        //background-color: rgb(255, 255, 255, 0.9);
        color: white;
        top: 35vh;
        left: 25vw;
        height: 30vh;
        width: 50vw;
    }
`

type GlowbuzzerContainerProps = {
    init?(connection)
}

const GlowbuzzerContainer: FC<GlowbuzzerContainerProps> = ({ children, init }) => {
    const connection = useConnection()
    const [configState, setConfigState] = useConfigState()
    const connectDelay = useRef(0)

    const { state, autoConnect, reconnect } = connection

    useEffect(() => {
        if (state === ConnectionState.DISCONNECTED && autoConnect) {
            setTimeout(reconnect, connectDelay.current)
            connectDelay.current = 5000
        }
    }, [state, autoConnect, reconnect])

    useEffect(() => {
        connectDelay.current = 0
    }, [autoConnect])

    useEffect(() => {
        if (configState === ConfigState.AWAITING_HLC_INIT) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            Promise.all([init ? init : () => {}]).then(() => setConfigState(ConfigState.READY))
        }
    }, [init, configState, setConfigState])

    function cancel() {
        connection.setAutoConnect(false)
    }

    function ConfigStateMessage() {
        if (state !== ConnectionState.CONNECTED) {
            return <>Connecting...</>
        }

        switch (configState) {
            case ConfigState.AWAITING_CONFIG:
                return <>Waiting for config</>
            case ConfigState.AWAITING_HLC_INIT:
                return <>Initializing</>
            default:
                return null
        }
    }

    return (
        <div>
            <GlowbuzzerDimmerStyle
                visible={
                    !(connection.connected && configState === ConfigState.READY) &&
                    connection.autoConnect
                }
            >
                <div className="reconnect-panel">
                    <div>
                        <p>
                            <ConfigStateMessage />
                        </p>
                        <Button icon={<CloseOutlined />} onClick={cancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </GlowbuzzerDimmerStyle>
            {children}
        </div>
    )
}

type GlowbuzzerAppProps = {
    storeEnhancers?: StoreEnhancer[]
}

export const GlowbuzzerApp: FC<GlowbuzzerAppProps> = ({ storeEnhancers, children }) => {
    const middleware = getDefault => {
        return getDefault({ immutableCheck: false, serializableCheck: false })
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware,
        enhancers: storeEnhancers
    })

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <GlowbuzzerContainer>{children}</GlowbuzzerContainer>
            </Provider>
        </ThemeProvider>
    )
}
