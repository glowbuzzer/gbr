/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"

/**
 * @ignore
 */
export const ConnectTileHelp = () => (
    <div>
        <h4>Connection Tile</h4>
        <p>
            The connection tile is used to connect to GBC and the PLC (GBEM/GBSM etc.) and manage
            their joint state.
        </p>
        <p>
            The "Simulate" and "Live" buttons toggle between Simulating a PLC and being connected
            live to a PLC and controlling a real machine.
        </p>
        <p>
            The "Disabled" and "Live" buttons control the state of the machine. Disabled means the
            machine is not operational whereas Live means the machine is able to move
        </p>
        <p>"Current" state shows the current state of the real or simulated machine</p>
        <p>
            In the bottom half of the tile, faults are displayed. Ether active faults or a fault
            history.
        </p>
    </div>
)
