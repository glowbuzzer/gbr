/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useContext } from "react"
import { GlowbuzzerDockLayoutContext } from "./GlowbuzzerDockLayoutProvider"
import { Layout } from "flexlayout-react"

export const GlowbuzzerDockLayout = () => {
    const { model, factory, updateModel } = useContext(GlowbuzzerDockLayoutContext)

    return (
        <Layout
            model={model}
            factory={factory}
            font={{ size: "12px" }}
            realtimeResize={true}
            onModelChange={updateModel}
        />
    )
}
