/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"
import * as React from "react"

/**
 * @ignore
 */
export const GCodeTileHelp = () => (
    <div>
        <h4>Gcode Tile</h4>
        <p>The Gcode Tile is used to load and stream gcode programes to the machine.</p>
        <p>A Gcode program can be types or pasted into the tile's body</p>
        <p>
            The <CaretRightOutlined /> button starts the gcode streaming to the machine and jobs can
            be paused with the <PauseOutlined /> button.
        </p>
        <p>
            {" "}
            Jobs can be stopped with the <StopIcon /> button.
        </p>
        <p>
            The gcode work offset (G54, G55 etc. which are set from frames in your config.json) file
            can be applied before a job is run.
        </p>
        <p>The estimated job running time is shown on the tile's top bar.</p>
    </div>
)
