/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { GlowbuzzerConfig, MoveParametersConfig, ToolConfig } from "../gbc"
import { RootState } from "../root"
import deepEqual from "fast-deep-equal"

export const DEFAULT_CONFIG: GlowbuzzerConfig = {
    frames: [{}],
    kinematicsConfiguration: [
        {
            linearLimits: [{}],
            participatingJoints: []
        }
    ],
    joint: []
}

export enum ConfigState {
    AWAITING_CONFIG = "AWAITING CONFIG",
    AWAITING_HLC_INIT = "AWAITING INIT",
    READY = "READY"
}

export const configSlice: Slice<{
    state: ConfigState
    version: number
    value: GlowbuzzerConfig
}> = createSlice({
    name: "config",
    initialState: {
        state: ConfigState.AWAITING_CONFIG as ConfigState,
        version: 1,
        // basic default value to avoid errors from components on startup
        value: DEFAULT_CONFIG
    },
    reducers: {
        setConfig(state, action) {
            state.version++
            state.state = ConfigState.AWAITING_HLC_INIT // GlowbuzzerApp will handle this state
            state.value = action.payload
            // save(action.payload)
        },
        setConfigState(state, action) {
            state.state = action.payload
        }
    }
})

/**
 * @ignore
 */
export function useConfigState() {
    const dispatch = useDispatch()
    // return value and setter
    return [
        useSelector((state: RootState) => state.config.state, shallowEqual),
        state => dispatch(configSlice.actions.setConfigState(state))
    ] as [ConfigState, (state: ConfigState) => void]
}

/**
 * Returns the current configuration as provided by GBC.
 */
export function useConfig() {
    return useSelector(
        (state: RootState) => state.config,
        (a, b) => a.version === b.version // only update on version change
    ).value
}

const EMPTY_TOOL: ToolConfig = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
}

/**
 * Returns the configuration for the given tool index.
 *
 * @param toolIndex The tool index
 */
export function useToolConfig(toolIndex: number): ToolConfig {
    return useSelector(
        (state: RootState) =>
            state.config.value.tool
                ? Object.values(state?.config?.value?.tool)[toolIndex]
                : EMPTY_TOOL,
        deepEqual
    )
}

/**
 * Returns the configuration for all tools.
 */
export function useToolList(): ToolConfig[] {
    return useSelector((state: RootState) => state.config.value.tool, deepEqual)
}

/**
 * Returns the default move parameters. This is the first move parameters entry, if configured
 */
export function useDefaultMoveParameters(): MoveParametersConfig {
    return useSelector((state: RootState) => {
        const v = state.config?.value?.moveParameters?.[0] || {}
        // strip the name from move params as it's not valid in websocket message to gbc
        const { name, ...props } = v
        return props
    }, deepEqual)
}
