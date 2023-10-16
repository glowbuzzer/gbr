/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeLoadedRobotParts, AwTubeRobotParts } from "./types"
import { useGLTF } from "@react-three/drei"
import { Group, Material, Mesh } from "three"

/**
 * Loads the robot parts from the assets folder and attaches them to object property of the loaded parts
 * @param parts The parts to be loaded
 */
export function useLoadedRobotParts(parts: AwTubeRobotParts): AwTubeLoadedRobotParts {
    return Object.fromEntries(
        Object.entries(parts).map(([name, part]) => {
            const object = useGLTF(`/assets/awtube/${part.filename}`).scene.clone()
            return [
                name,
                {
                    ...part,
                    object
                }
            ]
        })
    ) as AwTubeLoadedRobotParts
}
