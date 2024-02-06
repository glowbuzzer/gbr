/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

export function log(...args) {
    console.log(new Date().toISOString(), ...args)
}
