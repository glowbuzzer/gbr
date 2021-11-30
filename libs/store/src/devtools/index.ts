import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useConnect } from "../connect"

export const devToolsSlice: Slice<{ statusFrequency: number }> = createSlice({
    name: "devtools",
    initialState: {
        statusFrequency: null
    },
    reducers: {
        status(store, action) {
            store.statusFrequency = action.payload.statusFrequency
        }
    }
})

export function updateStatusFrequencyMsg(value: number) {
    return JSON.stringify({
        devtools: {
            statusFrequency: value
        }
    })
}

export const useDevTools = () => {
    const devtools = useSelector(({ devtools }: RootState) => devtools, shallowEqual)
    const dispatch = useDispatch()
    const connection = useConnect()
    return {
        ...devtools,
        setStatusFrequency(value: number) {
            window.localStorage.setItem("devtools.statusFrequency", JSON.stringify(value))
            dispatch(() => {
                connection.send(updateStatusFrequencyMsg(value))
            })
        }
    }
}
