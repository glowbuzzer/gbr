/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useDockLayoutContext } from "../dock/hooks"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileDefinitions"

/** @ignore */
export const ThreeDimensionalSceneShowFramesButton = () => {
    const { showTile, tiles } = useDockLayoutContext()

    if (!tiles[GlowbuzzerTileIdentifiers.FRAMES]) {
        // TODO: this leaves a gap in the toolbar
        return null
    }

    return (
        <GlowbuzzerIcon
            name={"frames"}
            Icon={FramesIcon}
            button
            title="Show frames"
            onClick={() => showTile(GlowbuzzerTileIdentifiers.FRAMES, true)}
        />
    )
}
