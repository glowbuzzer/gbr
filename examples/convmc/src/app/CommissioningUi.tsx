import React from "react"
import { SimpleTileDefinition, SimpleTileLayout } from "@glowbuzzer/controls"
import {
    AnalogInputsTile,
    ConnectTile,
    DevToolsTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    JogTile
} from "@glowbuzzer/controls"
import { ConveyorsTile } from "../components/ConveyorsTile"
import { dinLabels, doutLabels } from "./labels"
import { TestMotionTile } from "../components/TestMotionTile"

export const CommissioningUi = () => {
    const tiles: SimpleTileDefinition[][] = [
        [
            { render: <ConnectTile />, height: 4, title: "Connection" },
            { render: <DevToolsTile />, height: 4, title: "Dev Tools" },
            { render: <TestMotionTile />, height: 4, title: "Test Motion" },
            { render: <JogTile />, height: 4, title: "Jogging" }
        ],
        [
            {
                render: <DigitalOutputsTile labels={doutLabels} />,
                height: 4,
                title: "Digital Outputs"
            },
            {
                render: <DigitalInputsTile labels={dinLabels} />,
                height: 4,
                title: "Digital Inputs"
            },
            { render: <AnalogInputsTile labels={[]} />, height: 4, title: "Analog Inputs" },
            { render: <ConveyorsTile />, height: 4, title: "Conveyors" }
        ]
    ]

    return <SimpleTileLayout appId="convmc" tiles={tiles} widths={[4, 4]} />
}
