/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useGlowbuzzerDock } from "../dock/hooks"
import { GlowbuzzerDockComponent } from "@glowbuzzer/controls"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

export const ToolpathShowFramesButton = () => {
    const { showComponent, components } = useGlowbuzzerDock()

    if (!components[GlowbuzzerDockComponent.FRAMES]) {
        return null
    }

    return (
        <GlowbuzzerIcon
            name={"frames"}
            Icon={FramesIcon}
            button
            title="Show frames"
            onClick={() => showComponent(GlowbuzzerDockComponent.FRAMES, true)}
        />
    )
}
