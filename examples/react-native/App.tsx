import { StatusBar } from "expo-status-bar"
import { Image, StyleSheet, View } from "react-native"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { rootReducer } from "@glowbuzzer/store"
import { SimpleConnectView } from "./SimpleConnectView"
import { SimpleMoveView } from "./SimpleMoveView"

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
