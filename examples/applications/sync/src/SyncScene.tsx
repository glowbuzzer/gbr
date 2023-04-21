/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { StaubliRobot } from "../../../util/StaubliRobot"
import { TrackPosition, useScale } from "@glowbuzzer/controls"
import { Puck } from "./Puck"
import { Environment, Plane } from "@react-three/drei"
import React from "react"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

export const SyncScene = () => {
    const { extent } = useScale()
    const distance = extent * 2

    return (
        <>
            <StaubliRobot kinematicsConfigurationIndex={0} />
            <TrackPosition kinematicsConfigurationIndex={1}>
                <Puck />
            </TrackPosition>
            <PlaneShinyMetal />
            <DefaultEnvironment />
        </>
    )
}
