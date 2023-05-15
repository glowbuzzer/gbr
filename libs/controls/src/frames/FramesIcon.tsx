/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ReactComponent as FramesIconIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

/**
 * @ignore
 */
export const FramesIcon = props => (
    <GlowbuzzerIcon Icon={FramesIconIcon} useFill={true} name={"frames"} {...props} />
)
