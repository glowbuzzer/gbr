import { Tile } from "../tiles"
import * as React from "react"
import { JointDro } from "./JointDro"

export const JointDroTile = () => {
    return (
        <Tile title="Joint DRO">
            <JointDro warningThreshold={0.05} />
        </Tile>
    )
}
