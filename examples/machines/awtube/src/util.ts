/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Vector3 } from "three"
import { LoadedRobotDefinition } from "./types"
import { useGLTF } from "@react-three/drei"

export function translate_x(x: number) {
    return new Vector3(x, 0, 0)
}

export function translate_y(y: number) {
    return new Vector3(0, y, 0)
}

export function translate_z(z) {
    return new Vector3(0, 0, z)
}

export function translate_x_y(x: number, y: number) {
    return new Vector3(x, y, 0)
}

export function useLoadedRobotDefinition(definition): LoadedRobotDefinition {
    return definition.map(definition => {
        const object = useGLTF(`/assets/aw/awtube/${definition.filename}`).scene.clone()
        return {
            ...definition,
            object
        }
    }) as LoadedRobotDefinition
}
