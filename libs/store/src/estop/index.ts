/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { MACHINETARGET, useDigitalInputs, useMachine, useMachineConfig } from ".."

export function useEstop(): boolean {
    const config = useMachineConfig()
    const { target } = useMachine()
    const inputs = useDigitalInputs()

    if (target !== MACHINETARGET.MACHINETARGET_FIELDBUS || !config.estopEnabled) {
        return false
    }

    const value = inputs[config.estopInput]
    return !value // low means we are in estop
}
