/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useToolIndex, useToolList } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"

const RenderTool = ({ filename }) => {
    const model = useGLTF("/gb/" + filename, "/assets/draco/").scene.clone()

    return <primitive object={model} scale={1000} />
}

export const ActiveTool = ({ kinematicsConfigurationIndex = 0 }) => {
    const tools = useToolList()
    const activeToolIndex = useToolIndex(kinematicsConfigurationIndex)

    const activeTool = tools[activeToolIndex]
    if (!activeTool.$metadata.filename) {
        return null
    }

    return <RenderTool filename={activeTool.$metadata.filename} />
}
