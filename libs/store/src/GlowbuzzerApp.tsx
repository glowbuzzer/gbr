import * as React from "react"
import { useEffect } from "react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { useConnect } from "./connect"
import { usePrefs } from "./prefs"
import styled, { css, ThemeProvider } from "styled-components"
import { rootReducer } from "./root"

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

const GlowbuzzerDimmerStyle = styled.div<{ connected: boolean }>`
    ${props =>
        !props.connected &&
        css`
            position: fixed;
            z-index: 300;
            background-color: rgba(1, 1, 1, 0.7);
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
        `}
`

const GlowbuzzerReconnectDiv = styled.div<{ visible: boolean }>`
    display: ${props => (props.visible ? "block" : "none")};
    position: fixed;
    z-index: 301;
    //background-color: rgb(255, 255, 255, 0.9);
    color: white;
    top: 35vh;
    left: 25vw;
    height: 30vh;
    width: 50vw;
`

const GlowbuzzerContainer = props => {
    const connection = useConnect()

    return (
        <div>
            <GlowbuzzerDimmerStyle connected={connection.connected} />
            <GlowbuzzerReconnectDiv visible={!connection.connected}>I NEED TO RECONNECT</GlowbuzzerReconnectDiv>
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
