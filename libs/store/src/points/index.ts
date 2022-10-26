/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useConfig } from "@glowbuzzer/store"

export function usePoints() {
    const config = useConfig()
    return (
        // normalise points
        config.points?.map(p => ({
            ...p,
            translation: {
                x: 0,
                y: 0,
                z: 0,
                ...p.translation
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1,
                ...p.rotation
            }
        })) || []
    )
}
