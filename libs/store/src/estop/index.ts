/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useDigitalInputs, useMachineConfig } from ".."

export function useEstop(): boolean {
    const config = useMachineConfig()
    const inputs = useDigitalInputs()

    if (!config.estopEnabled) {
        return false
    }

    return inputs[config.estopInput]
}
