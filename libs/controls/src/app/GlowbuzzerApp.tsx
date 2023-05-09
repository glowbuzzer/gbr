/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FC, ReactNode, useEffect, useRef } from "react"
import { combineReducers, configureStore, Reducer, StoreEnhancer } from "@reduxjs/toolkit"
import {
    configSlice,
    ConfigState,
    ConnectionState,
    framesSlice,
    GlowbuzzerConfig,
    initSettings,
    prefsSlice,
    standardReducers,
    telemetrySlice,
    useConfigState,
    useConnection
} from "@glowbuzzer/store"
import styled, { css, ThemeProvider } from "styled-components"
import { Button } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { Provider } from "react-redux"
import { ConfigLiveEditProvider } from "../config"
import { appNameContext } from "./hooks"
import { ConnectionProvider } from "./ConnectionProvider"
import { GlowbuzzerAppLifecycle } from "./lifecycle"

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

const GlowbuzzerMainStyle = styled.div``

type GlowbuzzerContainerProps = {
    children: ReactNode
}

const GlowbuzzerContainer: FC<GlowbuzzerContainerProps> = ({ children }) => {
    const connection = useConnection()
    const [configState] = useConfigState()
    const connectDelay = useRef(0)

    const { state, autoConnect, reconnect } = connection

    useEffect(() => {
        if (state === ConnectionState.DISCONNECTED && autoConnect) {
            const timer = setTimeout(() => {
                reconnect()
            }, connectDelay.current)

            connectDelay.current = 5000

            return () => clearTimeout(timer)
        }
    }, [state, autoConnect, reconnect])

    useEffect(() => {
        connectDelay.current = 0
    }, [autoConnect])

    function cancel() {
        connection.disconnect()
    }

    function ConfigStateMessage() {
        if (state !== ConnectionState.CONNECTED) {
            return <>Connecting...</>
        } else if (configState === ConfigState.AWAITING_CONFIG) {
            return <>Waiting for config</>
        }
        return null
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
            <GlowbuzzerMainStyle>{children}</GlowbuzzerMainStyle>
        </div>
    )
}

type GlowbuzzerAppProps = {
    /** The unique name for the application, used to prefix local storage keys */
    appName: string
    /** Enhancers that can be used to manipulate the store. See [the Redux Toolkit documentation](https://redux-toolkit.js.org/api/configureStore#enhancers) */
    storeEnhancers?: StoreEnhancer[]
    additionalReducers?: { [index: string]: Reducer }
    /** Configuration to load into the store. If not provided, the configuration will be loaded from local storage, or from GBC upon connect. */
    configuration?: GlowbuzzerConfig
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
export const GlowbuzzerApp = ({
    appName,
    storeEnhancers,
    additionalReducers,
    configuration,
    children
}: GlowbuzzerAppProps) => {
    initSettings(appName)

    const store = GlowbuzzerAppLifecycle.createStore(
        configuration,
        storeEnhancers,
        additionalReducers
    )

    return (
        <appNameContext.Provider value={appName}>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <ConnectionProvider>
                        <ConfigLiveEditProvider>
                            <GlowbuzzerContainer>{children}</GlowbuzzerContainer>
                        </ConfigLiveEditProvider>
                    </ConnectionProvider>
                </Provider>
            </ThemeProvider>
        </appNameContext.Provider>
    )
}
