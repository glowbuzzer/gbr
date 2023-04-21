/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ExampleTileContent } from "../../../util/styles"
import { Space, Switch } from "antd"
import React from "react"
import { useDigitalOutputState } from "@glowbuzzer/store"

export const ToggleDigitalOutputTile = () => {
    const [dout, setDout] = useDigitalOutputState(0) // use the 1st digital output

    function handle_state_change() {
        const new_state = !dout.setValue // toggle
        setDout(new_state, true) // set new state (and override any existing state)
    }

    return (
        <ExampleTileContent>
            <Space>
                Toggle my digital output
                <Switch checked={dout.setValue} onChange={handle_state_change} />
            </Space>
        </ExampleTileContent>
    )
}
