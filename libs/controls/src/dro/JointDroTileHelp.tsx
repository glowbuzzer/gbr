/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"

/**
 * @ignore
 */
export const JointDroTileHelp = () => (
    <div>
        <h4>Joint DRO Tile</h4>
        <p>
            The Joint DRO Tile shows the positions of all the joints across all kinematics
            configurations (kcs).
        </p>
        <p>
            The position is shown in linear units (mm/inches) for prismatic joints and rotary units
            (deg/radians) for revolute (rotary) joints{" "}
        </p>
        <p>
            If the joint has been configured with a <code>negLimit</code> and <code>posLimit</code>{" "}
            in the config then a slider bar{" "}
        </p>
        <p>will be shown showing the extents of its allowed travel.</p>
        <p>The preferences menu can be used to select what linear and angular units are shown.</p>
    </div>
)
