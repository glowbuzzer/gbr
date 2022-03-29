import * as React from "react"
import { Tile } from "@glowbuzzer/layout"
import { CartesianDro } from "@glowbuzzer/controls"

// TODO: migrate somewhere else
export const SimpleDroTile = () => {
    return (
        <Tile title="Digital Readout">
            <CartesianDro kinematicsConfigurationIndex={0} hideFrameSelect={false} select="x,y,z" />
        </Tile>
    )
}
