import React from "react"
import { useSelector } from "react-redux"

export const MyComponent = () => {
    const state = useSelector((state: any) => state.dummy)

    return <>STATE IS: {state.value}</>
}
