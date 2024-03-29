/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { MACHINETARGET } from "../gbc"

export function updateMachineCommandMsg(command) {
    return JSON.stringify({
        command: {
            machine: {
                0: {
                    command
                }
            }
        }
    })
}

export function updateMachineControlWordMsg(controlWord: number) {
    return updateMachineCommandMsg({ controlWord })
}

export function updateMachineTargetMsg(target: MACHINETARGET) {
    return updateMachineCommandMsg({ target })
}
