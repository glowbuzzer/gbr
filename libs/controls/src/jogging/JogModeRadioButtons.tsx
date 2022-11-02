/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { JogMode } from "./types"
import { ReactComponent as JogModeContinuousIcon } from "@material-symbols/svg-400/outlined/zoom_out_map.svg"
import { ReactComponent as JogModeStepIcon } from "@material-symbols/svg-400/outlined/keyboard_tab.svg"
import { ReactComponent as JogModeGotoIcon } from "@material-symbols/svg-400/outlined/ads_click.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

/** @ignore - internal to the jog tile */
export const JogModeRadioButtons = ({ mode, onChange }) => {
    const options = [
        { mode: JogMode.CONTINUOUS, title: "Continuous Jog", icon: JogModeContinuousIcon },
        { mode: JogMode.STEP, title: "Step Jog", icon: JogModeStepIcon },
        { mode: JogMode.GOTO, title: "Goto", icon: JogModeGotoIcon }
    ]
    return (
        <DockToolbarButtonGroup>
            {options.map(({ mode: m, title, icon }) => (
                <GlowbuzzerIcon
                    key={m}
                    Icon={icon}
                    button
                    title={title}
                    checked={mode === m}
                    onClick={() => onChange(m)}
                />
            ))}
        </DockToolbarButtonGroup>
    )
}
