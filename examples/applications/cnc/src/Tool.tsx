/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useToolConfig, useToolList } from "@glowbuzzer/store"
import { useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { Box3, Group } from "three"
import { useFrame, useThree } from "@react-three/fiber"

// helper to identify valid tools

export const Tool = ({ toolIndex, spinning = false, ccw = false }) => {
    const { translation } = useToolConfig(toolIndex)
    const tool_list = useToolList()

    const { invalidate } = useThree()
    const toolRef = useRef<Group>()

    function valid_tool(t) {
        return t.name !== "Unused"
    }

    const models = useMemo(() => {
        return useGLTF(
            [
                "Spindle Tool Holder ISO30-ER32.glb",
                ...tool_list.filter(valid_tool).map(t => `tools/${t.name}.glb`)
            ].map(name => `/assets/${name}`)
        ).map(m => {
            return m.scene.clone()
        })
    }, [])

    // build a lookup from tool list to model index
    const tool_lookup = Object.fromEntries(
        tool_list
            .map((t, index) => [index, t])
            .filter(([, t]) => valid_tool(t))
            .map(([index], lookup) => [index, lookup])
    )

    const toolHolder = models[0]
    const toolHolderHeight = useMemo(() => {
        const tb = new Box3().setFromObject(toolHolder)
        return (tb.max.x - tb.min.x) * 1000
    }, [toolHolder])

    const tools = useMemo(() => {
        return models.slice(1).map((model, index) => {
            // uncomment to get empirical bounds of the model
            // const box = new Box3().setFromObject(model)
            // const x = box.max.x - box.min.x
            // const y = box.max.y - box.min.y
            // const z = box.max.z - box.min.z
            // console.log("width for", index, "=", x * 1000, z * 1000)
            return model
        })
    }, [models])

    useFrame(() => {
        if (spinning && toolRef.current) {
            toolRef.current.rotation.y += ccw ? -0.5 : 0.5
            invalidate()
        }
    })

    const tool = tools[tool_lookup[toolIndex]]
    const len = tool_list[toolIndex]?.translation.z
    return (
        <group position={[0, 0, /*-translation.z */ 0]}>
            <primitive
                scale={[1000, 1000, 1000]}
                object={toolHolder}
                rotation={[Math.PI, -Math.PI / 2, 0]}
            />
            {tool && (
                <primitive
                    ref={toolRef}
                    scale={[1000, 1000, 1000]}
                    object={tool}
                    position={[0, 0, -len - toolHolderHeight]}
                    rotation={[-Math.PI / 2, 0, 0]}
                />
            )}
        </group>
    )
}
