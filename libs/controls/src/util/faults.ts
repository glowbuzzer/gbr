/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { FAULT_CAUSE } from "@glowbuzzer/store"

export function filter_fault_causes(value: number) {
    return Object.values(FAULT_CAUSE)
        .filter(k => typeof k === "number")
        .filter((k: number) => value & (1 << k))
        .map(k => ({
            code: k,
            description: FAULT_CAUSE[k].slice(12, -8)
        }))
}
