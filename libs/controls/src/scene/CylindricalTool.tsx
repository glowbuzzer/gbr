/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { forwardRef } from "react"
import { useToolConfig } from "@glowbuzzer/store"
import { Cylinder } from "@react-three/drei"

type CylindricalToolProps = {
    /** The index of the current tool in the configuration */
    toolIndex: number
    /** The color of the tool */
    color?: number
}

/**
 * The CylindricalTool component renders a simple tool with a cylindrical shape. It can be added to the {@link BasicRobot} component.
 */
export const CylindricalTool = forwardRef(
    ({ toolIndex, color = 0x666666 }: CylindricalToolProps, ref) => {
        const toolConfig = useToolConfig(toolIndex)

        if (!toolConfig) {
            console.warn(`No tool configuration found for tool ${toolIndex}`)
        }
        const x = toolConfig?.translation?.x || 0
        const y = toolConfig?.translation?.y || 0
        const z = toolConfig?.translation?.z || 0

        const toolDiameter = toolConfig.diameter / 2 || 0

        return (
            <Cylinder
                ref={ref}
                args={[toolDiameter, toolDiameter, z, 32]}
                position={[x, y, z / 2]}
                rotation={[Math.PI / 2, 0, 0]}
                material-color={color}
            />
        )
    }
)
