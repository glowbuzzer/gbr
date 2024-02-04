/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"

/**
 * @ignore
 */
export const SafetyDigitalOutputsTileHelp = () => (
    <div>
        <h4>Safety Digital Outputs Tile</h4>
        <p>
            The Safety Digital Outputs Tile allows you to control safety digital outputs on your
            machine.
        </p>
        <p>
            If you want your outputs to be controlled by your programs (or gcode) then set "Auto"
            mode in the dropdown.{" "}
        </p>
        <p>
            If you want to force the value of the output from the Tile, set "Override" mode in the
            dropdown.
        </p>
        <p>In override mode the value can be changed with the toggle switch.</p>
        <p>
            The current value of the output will be shown in the state indicator on the far right.
        </p>
    </div>
)
