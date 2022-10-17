/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogCartesianPanel, JogJointsPanel } from "@glowbuzzer/controls"
import { JogMode } from "./types"

export const JogJointsTile = () => {
    return (
        <JogJointsPanel
            jogMode={JogMode.CONTINUOUS}
            jogSpeed={100}
            kinematicsConfigurationIndex={0}
            onChangeKinematicsConfigurationIndex={() => {}}
        />
    )
}
