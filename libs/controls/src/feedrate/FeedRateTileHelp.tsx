/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"

export const FeedRateTileHelp = () => (
    <div>
        <h4>Feedrate Tile</h4>
        <p>The Feedrate tile is used to override the default velocity of moves.</p>
        <p>If the feed rate slider is set to more than 100% moves are sped up.</p>
        <p>If the feed rate slider is set to less than 100% moves are slowed down.</p>
        <p>An example of using is would be if you are executing a gcode program and you</p>
        <p>feel you could safely increase the speed (velocity of the tool) then you would</p>
        <p>override the feedate by say 150%.</p>
        <p>Each kinematics configuration (kc) has its own feedrate override so there is a </p>
        <p>drondown to select the kc.</p>
    </div>
)
