/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useEffect } from "react"
import {
    MACHINETARGET,
    useConnection,
    useMachine,
    useOverallSafetyStateInput,
    useSafetyDigitalInputList
} from "@glowbuzzer/store"

export const AutoSimulatedSafetyInputsController = () => {
    const { connected, send } = useConnection()
    const machine = useMachine()
    const safetyInputs = useSafetyDigitalInputList()
    const overallSafetyStateInput = useOverallSafetyStateInput()

    const sim = machine.requestedTarget === MACHINETARGET.MACHINETARGET_SIMULATION

    useEffect(() => {
        // this can be 'undefined' if no safety configured, so we want to test for explicit false
        if (connected && sim && overallSafetyStateInput === false) {
            // we're going to force all inputs into the non-negative state
            const overrides = Object.fromEntries(
                safetyInputs.map((input, index) => {
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
    }, [overallSafetyStateInput, connected, sim])

    return null
}
