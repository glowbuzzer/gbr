/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogCartesianPanel } from "@glowbuzzer/controls"
import { JogMode } from "./types"
import React, { useState } from "react"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogGotoCartesian } from "./JogGotoCartesian"

export const JogCartesianTile = () => {
    const [jogMode, setJogMode] = useState(JogMode.CONTINUOUS)

    switch (jogMode) {
        case JogMode.CONTINUOUS:
        case JogMode.STEP:
            return (
                <JogArrowsCartesian jogMode={jogMode} onChangeJogMode={setJogMode} jogSpeed={100} />
            )

        case JogMode.GOTO:
            return (
                <JogGotoCartesian
                    jogMode={jogMode}
                    jogSpeed={100}
                    onChangeJogMode={setJogMode}
                    showRobotConfiguration
                />
            )
    }
}
