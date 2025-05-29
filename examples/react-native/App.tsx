// noinspection TypeScriptCheckImport

// @ts-ignore
import { StatusBar } from "expo-status-bar"
// @ts-ignore
import { Image, StyleSheet, View } from "react-native"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
// @ts-ignore
import { rootReducer } from "@glowbuzzer/store"
// @ts-ignore
import { SimpleConnectView } from "./SimpleConnectView"
// @ts-ignore
import { SimpleMoveView } from "./SimpleMoveView"
import * as React from "react"

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default function App() {
    const middleware = getDefault => {
        return getDefault({ immutableCheck: false, serializableCheck: false })
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware
    })

    return (
        // @ts-ignore
        <Provider store={store}>
            <View style={style.container}>
                <Image source={require("./assets/react-icon.png")} />
                <SimpleConnectView />
                <SimpleMoveView />
                <StatusBar style="auto" />
            </View>
        </Provider>
    )
}
