/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useKinematicsLimitsDisabled } from "@glowbuzzer/store"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

import { ReactComponent as JogLimitIcon } from "@material-symbols/svg-400/outlined/front_hand.svg"

/** @ignore - internal to the jog tiles */
export const JogLimitsToolbarButton = ({ kinematicsConfigurationIndex }) => {
    const [disabled, setDisabled] = useKinematicsLimitsDisabled(kinematicsConfigurationIndex)

    return (
        <GlowbuzzerIcon
            Icon={JogLimitIcon}
            button
            title="Enable Travel Limits"
            checked={!disabled}
            onClick={() => setDisabled(!disabled)}
        />
    )
}
