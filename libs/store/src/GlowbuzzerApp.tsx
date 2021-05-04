import * as React from "react"
import { FC, useEffect, useRef, useState } from "react"
import { Provider } from "react-redux"
import { configureStore, StoreEnhancer } from "@reduxjs/toolkit"
import { connectionSlice, useConnect } from "./connect"
import { usePrefs } from "./prefs"
import styled, { css, ThemeProvider } from "styled-components"
import { rootReducer } from "./root"
import { Button } from "antd"
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons"
import { ConfigState, useConfigState } from "./config"

const Startup = ({ autoConnect }) => {
    const connection = useConnect()
    const prefs = usePrefs()

    useEffect(() => {
        if (autoConnect) {
            console.log("AUTO CONNECT")
            connection.connect(prefs.current.url)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoConnect])

    return null
}

const theme = {
    colors: {
        border: "#cccccc"
    }
}

declare module "styled-components" {
    type Theme = typeof theme

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}

const GlowbuzzerAppStyle = styled.div<{ minWidth: string }>`
    min-width: ${props => props.minWidth};
`

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
    minWidth?: string
    init?(connection)
}

const GlowbuzzerContainer: FC<GlowbuzzerContainerProps> = ({ children, init, minWidth }) => {
    const connection = useConnect()
    const [configState, setConfigState] = useConfigState()

    const [countdown, setCountdown] = useState(2)
    const [showRetry, setShowRetry] = useState(true)
    const timer = useRef(null)
    const interval = useRef(3)

    useEffect(() => {
        if (connection.autoConnect && !connection.connected) {
            timer.current = setInterval(() => {
                setCountdown(countdown => {
                    countdown--
                    if (countdown === 0) {
                        interval.current = Math.min(30, interval.current * 2)
                        countdown = interval.current
                        setShowRetry(false)
                        setTimeout(() => connection.reconnect(), 0)
                    } else {
                        setShowRetry(true)
                    }
                    return countdown
                })
            }, 1000)
            return () => clearInterval(timer.current)
        }
    }, [connection, connection.autoConnect, connection.connected])

    useEffect(() => {
        if (configState === ConfigState.AWAITING_HLC_INIT) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            Promise.all([init ? init : () => {}]).then(() => setConfigState(ConfigState.READY))
        }
    }, [init, configState, setConfigState])

    function retry_now() {
        setCountdown(2)
    }

    function cancel() {
        setCountdown(2)
        interval.current = 3
        connection.setAutoConnect(false)
    }

    function ConfigStateMessage() {
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
        <GlowbuzzerAppStyle minWidth={minWidth || "3160px"}>
            <GlowbuzzerDimmerStyle visible={!(connection.connected && configState === ConfigState.READY) && connection.autoConnect}>
                <div className="reconnect-panel">
                    <div>
                        {showRetry && countdown > 2 ? (
                            <>
                                <p>Retry in {countdown} second(s).</p>
                                <p>
                                    <Button icon={<ReloadOutlined />} onClick={retry_now}>
                                        Retry Now
                                    </Button>
                                    &nbsp;
                                    <Button icon={<CloseOutlined />} onClick={cancel}>
                                        Cancel
                                    </Button>
                                </p>
                            </>
                        ) : (
                            <ConfigStateMessage />
                        )}
                    </div>
                </div>
            </GlowbuzzerDimmerStyle>
            {children}
        </GlowbuzzerAppStyle>
    )
}

type GlowbuzzerAppProps = {
    autoConnect?: boolean
    minWidth?: string
    storeEnhancers?: StoreEnhancer[]
}

export const GlowbuzzerApp: FC<GlowbuzzerAppProps> = ({ autoConnect, minWidth, storeEnhancers, children }) => {
    const middleware = getDefault => {
        return getDefault({ immutableCheck: false, serializableCheck: false })
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware,
        enhancers: storeEnhancers
    })

    // pass autoConnect setting to the store on startup
    store.dispatch(connectionSlice.actions.autoConnect(autoConnect))

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Startup autoConnect={autoConnect} />
                <GlowbuzzerContainer minWidth={minWidth}>{children}</GlowbuzzerContainer>
            </Provider>
        </ThemeProvider>
    )
}
