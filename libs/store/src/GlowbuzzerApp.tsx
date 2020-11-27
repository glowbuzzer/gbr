import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { useConnect } from "./connect"
import { usePrefs } from "./prefs"
import styled, { css, ThemeProvider } from "styled-components"
import { rootReducer } from "./root"
import { Button } from "antd"
import { CloseOutlined, ReloadOutlined } from "@ant-design/icons"

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefault => getDefault({ immutableCheck: false, serializableCheck: false })
})

const Startup = () => {
    const connection = useConnect()
    const prefs = usePrefs()

    useEffect(() => {
        connection.connect(prefs.current.url)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

const GlowbuzzerContainer = props => {
    const connection = useConnect()

    const [countdown, setCountdown] = useState(2)
    const [showRetry, setShowRetry] = useState(true)
    const timer = useRef(null)
    const interval = useRef(3)

    useEffect(() => {
        if (connection.autoConnect && !connection.connected) {
            timer.current = setInterval(() => {
                console.log("INTERVAL!")
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

    function retry_now() {
        setCountdown(countdown => 2)
    }

    function cancel() {
        setCountdown(2)
        interval.current = 3
        connection.setAutoConnect(false)
    }

    return (
        <div>
            <GlowbuzzerDimmerStyle visible={!connection.connected && connection.autoConnect}>
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
                            <p>Connecting...</p>
                        )}
                    </div>
                </div>
            </GlowbuzzerDimmerStyle>
            {props.children}
        </div>
    )
}

export const GlowbuzzerApp = props => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Startup />
                <GlowbuzzerContainer>{props.children}</GlowbuzzerContainer>
            </Provider>
        </ThemeProvider>
    )
}
