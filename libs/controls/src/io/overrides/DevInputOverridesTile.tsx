/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Flex } from "antd"
import { useDispatch } from "react-redux"
import {
    createOverrideClearAction,
    createOverrideSetAction,
    digitalInputsSlice,
    safetyDigitalInputsSlice,
    useDigitalInputList,
    useDigitalInputs,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs
} from "@glowbuzzer/store"
import { DevDigitalInputOverrides } from "./DevDigitalInputOverrides"

/**
 * A tile to override input values. This tile is only useful during development to simulate inputs from GBC rather than rely on physical inputs.
 * The overrides are not visible to GBC, so they are not useful for testing GBC's reaction to events. For that, use a loopback from a digital output to
 * a digital input (simulation mode only).
 */
export const DevInputOverridesTile = () => {
    const digitalInputs = useDigitalInputs()
    const digitalInputList = useDigitalInputList()
    const safetyDigitalInputs = useSafetyDigitalInputs()
    const safetyDigitalInputList = useSafetyDigitalInputList()
    const dispatch = useDispatch()

    function clear_digital_inputs() {
        dispatch(createOverrideClearAction(digitalInputsSlice))
    }

    function set_digital_input(index: number, value: boolean) {
        dispatch(createOverrideSetAction(digitalInputsSlice, index, value))
    }

    function clear_safety_digital_inputs() {
        dispatch(createOverrideClearAction(safetyDigitalInputsSlice))
    }

    function set_safety_digital_input(index: number, value: boolean) {
        dispatch(createOverrideSetAction(safetyDigitalInputsSlice, index, value))
    }

    return (
        <div style={{ padding: "10px" }}>
            <p>
                Use this tile to override the values of digital and analog inputs. This is useful
                during development to simulate inputs from GBC rather than rely on physical inputs.
            </p>

            <Flex vertical gap="small">
                <DevDigitalInputOverrides
                    title={"Digital Inputs"}
                    labels={digitalInputList.map(c => c.name)}
                    inputs={digitalInputs}
                    onChange={set_digital_input}
                    onClear={clear_digital_inputs}
                />

                <DevDigitalInputOverrides
                    title={"Safety Digital Inputs"}
                    labels={safetyDigitalInputList.map(c => c.name)}
                    inputs={safetyDigitalInputs}
                    onChange={set_safety_digital_input}
                    onClear={clear_safety_digital_inputs}
                />
            </Flex>
        </div>
    )
}
