/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"

/**
 * @ignore
 */
export const StateMachineToolsTileHelp = () => (
    <div>
        <h4>StateMachine Tools Tile</h4>
        <p>
            The StateMachine Tools Tile allows the user to interact with the statemachine that
            exists on the PLC (GBEM/GBSM).
        </p>
        <p>
            It is not usually necessary to use this tile but it is useful for development where you
            want to
        </p>
        <p>force the statemachine into a specfic state.</p>
        <p>Usually you can use the Connect Tile's "Disabled" and "Enabled"</p>
        <p>
            buttons to jump from <code>SWITCH_ON_DISABLED</code> to <code>OPERATION_ENABLED</code>.
        </p>
    </div>
)
