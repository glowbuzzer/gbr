import * as React from "react"
import { useEffect } from "react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { useConnect } from "./connect"
import { usePrefs } from "./prefs"
import { ThemeProvider } from "styled-components"
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

export const GlowbuzzerApp = props => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Startup />
                {props.children}
            </Provider>
        </ThemeProvider>
    )
}
