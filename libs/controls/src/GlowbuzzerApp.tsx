/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FC, ReactNode, useEffect, useRef } from "react"
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
import { Provider } from "react-redux"

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
    children: ReactNode
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
    /** Enhancers that can be used to manipulate the store. See [the Redux Toolkit documentation](https://redux-toolkit.js.org/api/configureStore#enhancers) */
    storeEnhancers?: StoreEnhancer[]
    /** Your application */
    children: ReactNode
}

/**
 * Provides a convenient way to instantiate the default GBR Redux store in your application.
 *
 * This component also provides an overlay/dimmer that is activated when your application is connecting to GBC.
 *
 * The store that is created provides all the features needed to support the GBR tiles, controls and hooks.
 *
 * You can look at the source for this component to see how to configure the GBR Redux store from scratch.
 */
export const GlowbuzzerApp = ({ storeEnhancers, children }: GlowbuzzerAppProps) => {
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
