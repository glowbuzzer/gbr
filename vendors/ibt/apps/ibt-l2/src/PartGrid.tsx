/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { AwTubeRobotParts } from "@glowbuzzer/awlib"
import { TriadHelper } from "@glowbuzzer/controls"
import { useLoadedRobotParts } from "@glowbuzzer/awlib"

export const PartGrid = ({ definition }: { definition: AwTubeRobotParts }) => {
    const parts = useLoadedRobotParts(definition)

    return Object.values(parts).map(function (part, index) {
        const x = index % 5
        const y = Math.floor(index / 5)
        return (
            <group key={index} position={[-1600 + x * 300, -1000 + y * 500, 100]} scale={1000}>
                <TriadHelper size={0.2} />
                <primitive object={part.object} />
            </group>
        )
    })
}
