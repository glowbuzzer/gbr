/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CopyOutlined } from "@ant-design/icons"
import * as React from "react"

export const CartesianDroTileHelp = () => (
    <div>
        <h4>Cartesian DRO Tile</h4>
        <p>
            The Cartesian DRO Tile shows the <em>cartesian</em> position of the tool of a machine.
        </p>
        <p>Using the dropdown menu, you can select different kinematics configurations (kcs).</p>
        <p>Each kc will have its own cartesian position.</p>
        <p>
            Position is shown in terms of the x,y,z values in linear units and the orientation of
            the tool in Euler angles.
        </p>
        <p>
            Using the Zero DRO button. When you zero the DRO, all subsequent moves will be
            translated such that the origin is the current tool position.
        </p>
        <p>
            The reset button removes the temporary translation that was added by hitting the Zero
            DRO button.
        </p>
        <p>
            The clipboard copy button (...) copys the value of the current position to the clipbaord
            for you to use in programs you write.
        </p>
        <p>
            The clipboard mode property button (<CopyOutlined />) gives options to let the user to
            copy the current position in various formats.
        </p>
    </div>
)
