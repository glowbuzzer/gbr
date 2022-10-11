/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useGlowbuzzerDock } from "./dock/GlowbuzzerDockLayoutProvider"
import { BarsOutlined } from "@ant-design/icons"

export const ShowFramesButton = () => {
    const { showComponent } = useGlowbuzzerDock()

    return <BarsOutlined onClick={() => showComponent("frames", true)} />
}
