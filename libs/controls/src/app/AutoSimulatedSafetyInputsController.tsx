/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import {
    MACHINETARGET,
    useConnection,
    useMachine,
    useMachineInputMetadata,
    useOverallSafetyStateInput,
    useSafetyDigitalInputList,
    useSafetyDigitalInputState
} from "@glowbuzzer/store"

export const AutoSimulatedSafetyInputsController = () => {
    const { connected, send } = useConnection()
    const machine = useMachine()
    const safetyInputs = useSafetyDigitalInputList()
    const overallSafetyStateInput = useOverallSafetyStateInput()
    const metadata = useMachineInputMetadata("safetyStateInput")
    const [overallSafetyInput] = useSafetyDigitalInputState(metadata.index)

    const enabled =
        metadata.safety && machine.requestedTarget === MACHINETARGET.MACHINETARGET_SIMULATION

    useEffect(() => {
        // this can be 'undefined' if no safety configured, so we want to test for explicit false
        if (enabled && connected && overallSafetyStateInput === false) {
            console.log("forcing all inputs", enabled)
            // we're going to force all inputs into the non-negative state
            const overrides = Object.fromEntries(
                safetyInputs
                    .map((input, index) => {
                        if (index === metadata.index && overallSafetyInput.override) {
                            // if the overall safety input is already overridden, we don't want to change it
                            // (can be useful to toggle the safety state in simulation)
                            return
                        }
                        return [
                            index,
                            {
                                command: {
                                    setValue: input.$metadata?.negativeState ? 0 : 1, // non-negative state
                                    override: true
                                }
                            }
                        ]
                    })
                    .filter(Boolean)
            )

            send(
                JSON.stringify({
                    command: {
                        safetyDin: {
                            ...overrides
                        }
                    }
                })
            )
        }
    }, [overallSafetyStateInput, connected, enabled])

    return <></>
}
