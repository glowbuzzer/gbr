/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { ToolHolderConstants } from "./constants"
import { useFrame, useToolIndex, useToolList } from "@glowbuzzer/store"
import { Tool } from "./Tool"

export const ToolHolder = () => {
    const currentToolIndex = useToolIndex(0)
    const toolList = useToolList().slice(1) // don't include tool zero as we reserve this to mean "no tool"
    const toolHolderFrame = useFrame(ToolHolderConstants.frameIndex)

    const [holder] = useMemo(
        () => useGLTF(["Tool holder"].map(name => `/assets/${name}.glb`)).map(m => m.scene),
        []
    )

    const holders = useMemo(() => toolList.map(() => holder.clone()), [toolList, holder])

    const { spacing, holderToolOffset } = ToolHolderConstants
    const { x: originX, y: originY, z: originZ } = toolHolderFrame.translation
    const { x: holderToolOffsetX, y: holderToolOffsetY, z: holderToolOffsetZ } = holderToolOffset

    return (
        <group position={[originX, originY, originZ]}>
            <pointLight position={[0, 0, 100]} />
            <pointLight position={[100, 0, 100]} />
            {holders.map((h, i) => (
                <group key={i}>
                    <primitive
                        scale={[1000, 1000, 1000]}
                        position={[i * spacing, 0, 0]}
                        object={h}
                        rotation={[Math.PI / 2, Math.PI, 0]}
                    />
                    {currentToolIndex - 1 === i || (
                        <group
                            position={[
                                i * spacing + holderToolOffsetX,
                                holderToolOffsetY,
                                holderToolOffsetZ
                            ]}
                        >
                            <Tool toolIndex={i + 1} />
                        </group>
                    )}
                </group>
            ))}
        </group>
    )
}
