/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"

export const AnalogOutputsTileHelp = () => (
    <div>
        <h4>Analog Outputs Tile</h4>
        <p>The Analog Outputs Tile allows you to control analog outputs on your machine.</p>
        <p>
            If you want your outputs to be controlled by your programs (or gcode) then set "Auto"
            mode in the dropdown.{" "}
        </p>
        <p>
            If you want to force the value of the output from the Tile, set "Override" mode in the
            dropdown.
        </p>
        <p>
            In overide mode the value can be changed by specifying it the box and using the arrow
            button to trigger the set operation.
        </p>
        <p>The current value of the output will be shown in the indicator on the far right.</p>
    </div>
)
