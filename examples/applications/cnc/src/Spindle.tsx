/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useConfig, useDigitalOutputState, useToolConfig, useToolIndex } from "@glowbuzzer/store"
import { CylindricalTool, TrackPosition, TriadHelper } from "@glowbuzzer/controls"
import { Tool } from "./Tool"

export const Spindle = () => {
    const toolIndex = useToolIndex(0)
    const { translation } = useToolConfig(toolIndex)
    const spindleConfig = useConfig().spindle[0] // assumes a spindle is configured!
    const { enableDigitalOutIndex, directionDigitalOutIndex } = spindleConfig
    const [{ effectiveValue: spinning }] = useDigitalOutputState(enableDigitalOutIndex)
    const [{ effectiveValue: ccw }] = useDigitalOutputState(directionDigitalOutIndex)

    const [spindle] = useMemo(
        () =>
            useGLTF(["1746_ATC71-A-SN-ISO30"].map(name => `/assets/${name}.glb`)).map(m => m.scene),
        []
    )

    return (
        <TrackPosition kinematicsConfigurationIndex={0}>
            <group position={[0, 0, -translation.z - 104]}>
                {toolIndex > 0 && (
                    <group rotation={[Math.PI, 0, 0]} position={[0, 0, -5]}>
                        <Tool toolIndex={toolIndex} spinning={spinning} ccw={ccw} />
                    </group>
                )}
                <primitive
                    position={[0, 0, -250]}
                    scale={[1000, 1000, 1000]}
                    object={spindle}
                    rotation={[0, Math.PI / 2, 0]}
                />
            </group>
        </TrackPosition>
    )
}
