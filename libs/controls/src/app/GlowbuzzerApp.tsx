/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { FC, ReactNode, useEffect, useRef } from "react"
import { Reducer, StoreEnhancer } from "@reduxjs/toolkit"
import {
    ConfigState,
    ConnectionState,
    GbdbConfiguration,
    GlowbuzzerConfig,
    initSettings,
    useConfigState,
    useConnection
} from "@glowbuzzer/store"
import styled, { css } from "styled-components"
import { Button, GlobalToken } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { Provider } from "react-redux"
import { ConfigLiveEditProvider } from "../config"
import { appNameContext, connectionConfigurationContext } from "./hooks"
import { ConnectionProvider } from "./ConnectionProvider"
import { GlowbuzzerAppLifecycle } from "./lifecycle"
import { GlowbuzzerThemeProvider } from "./GlowbuzzerThemeProvider"
import { GbdbProvider } from "../gbdb"
import { AutoConnectionController } from "./AutoConnectionController"
import { AutoDesiredModeController } from "./AutoDesiredModeController"
import { UserModel, UserProvider } from "../usermgmt"
import { ConnectionConfiguration } from "./types"
import { AutoSimulatedSafetyInputsController } from "./AutoSimulatedSafetyInputsController"
import { GlowbuzzerErrorProvider } from "./GlowbuzzerErrorContext"

declare module "styled-components" {
    export interface DefaultTheme extends GlobalToken {}
}

export const GlowbuzzerDimmerStyle = styled.div<{ $visible: boolean }>`
    display: none;

    ${props =>
        props.$visible &&
        css`
            display: block;
            position: fixed;
            z-index: 600;
            background-color: rgba(1, 1, 1, 0.7);
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
        `}

    .reconnect-panel, .login-panel {
        position: fixed;
        text-align: center;
        z-index: 301;
        color: white;
        top: 35vh;
        left: 25vw;
        height: 30vh;
        width: 50vw;
    }
`

const GlowbuzzerMainStyle = styled.div`
    font-size: 14px;
    color: ${props => props.theme.colorText};
`

type GlowbuzzerContainerProps = {
    children: ReactNode
    userModel: UserModel
}

const GlowbuzzerContainer: FC<GlowbuzzerContainerProps> = ({ userModel, children }) => {
    const connection = useConnection()
    const configState = useConfigState()
    const connectDelay = useRef(0)

    const { state, autoConnect, reconnect } = connection

    useEffect(() => {
        // if (state === ConnectionState.DISCONNECTED && autoConnect) {
        //     const timer = setTimeout(() => {
        //         console.log("RECONNECT ON TIMER")
        //         reconnect()
        //     }, connectDelay.current)
        //
        //     connectDelay.current = 5000
        //
        //     return () => clearTimeout(timer)
        // }
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
        <>
            <GlowbuzzerDimmerStyle
                $visible={
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
            <UserProvider model={userModel}>
                <GlowbuzzerMainStyle>{children}</GlowbuzzerMainStyle>
            </UserProvider>
        </>
    )
}

type GlowbuzzerAppProps = {
    /** The unique name for the application, used to prefix local storage keys */
    appName: string
    /** Enhancers that can be used to manipulate the store. See [the Redux Toolkit documentation](https://redux-toolkit.js.org/api/configureStore#enhancers) */
    storeEnhancers?: StoreEnhancer[]
    /** Additional reducers to add to the store. You can use this to add slices to the Redux store. */
    additionalReducers?: { [index: string]: Reducer }
    /** Configuration to load into the store. If not provided, the configuration will be loaded from local storage, or from GBC upon connect. */
    configuration?: GlowbuzzerConfig
    /** Configuration for connection to remote services such as GBC*/
    connectionConfiguration?: ConnectionConfiguration
    /** Configuration for slice persistence */
    persistenceConfiguration?: GbdbConfiguration
    /** The user authentication model to use, if required */
    userModel?: UserModel
    /** Whether to auto-enable operation */
    autoOpEnabled?: boolean
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
    persistenceConfiguration,
    connectionConfiguration = {},
    autoOpEnabled,
    userModel,
    children
}: GlowbuzzerAppProps) => {
    initSettings(appName)
    const { manualConnect } = connectionConfiguration

    const store = GlowbuzzerAppLifecycle.createStore(
        configuration,
        storeEnhancers,
        additionalReducers,
        persistenceConfiguration
    )

    return (
        <connectionConfigurationContext.Provider value={connectionConfiguration}>
            <appNameContext.Provider value={appName}>
                <GlowbuzzerThemeProvider>
                    <GlowbuzzerErrorProvider>
                        <Provider store={store}>
                            <GbdbProvider configuration={persistenceConfiguration}>
                                <ConnectionProvider autoConnect={!manualConnect}>
                                    <ConfigLiveEditProvider>
                                        <GlowbuzzerContainer userModel={userModel}>
                                            <AutoConnectionController enabled={!manualConnect} />
                                            <AutoSimulatedSafetyInputsController />
                                            <AutoDesiredModeController enabled={autoOpEnabled}>
                                                {children}
                                            </AutoDesiredModeController>
                                        </GlowbuzzerContainer>
                                    </ConfigLiveEditProvider>
                                </ConnectionProvider>
                            </GbdbProvider>
                        </Provider>
                    </GlowbuzzerErrorProvider>
                </GlowbuzzerThemeProvider>
            </appNameContext.Provider>
        </connectionConfigurationContext.Provider>
    )
}
