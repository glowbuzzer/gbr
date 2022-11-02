/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"

/**
 * @ignore
 */
export const ThreeDimensionalSceneTileHelp = () => (
    <div>
        <h4>3D Scene Tile</h4>
        <p>The 3D Scene Tile performs a number of functions. These are:</p>
        <ol>
            <li>
                Shows the current position of the tool in 3D space which updates as the tool is
                moved by programs
            </li>
            <li>
                Shows the future position of the toolpath (if say a gcode program has been loaded)
            </li>
            <li>Shows past path the tool has followed</li>
            <li>Shows a 3D model of the machine (if available)</li>
            <li>Shows objects the machine may interact with</li>
        </ol>
        <p>
            The view has a set controls allowing the view to be panned, rotated and zoomed with the
            mouse.{" "}
        </p>
        <p>
            The view also shows the extents of the machine (its envelope) these can be overridden by
            using the top-right config button.
        </p>
    </div>
)
