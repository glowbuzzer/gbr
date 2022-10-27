/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"

export const ToolsTileHelp = () => (
    <div>
        <h4>Tools Tile</h4>
        <p>
            The Tools Tile shows the tools that have been configured in the tools section of the
            JSON config file.
        </p>
        <p>It allows a user to manually select a tool.</p>
        <p>
            The machine must be in the <code>OPERATION_ENABLED</code> state to perform a tool
            change.
        </p>
        <p>
            The Toolpath Display will show a change of position when tools of different lengths are
            selected.
        </p>
    </div>
)
