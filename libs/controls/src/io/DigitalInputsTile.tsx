import React from "react"
import { useDigitalInputs } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import { BitFieldDisplay } from "@glowbuzzer/controls"

export const DigitalInputsTile = ({ labels = [] }) => {
    const din = useDigitalInputs()

    const dinValue = din.reduce((value, current, index) => value | (current ? 1 << index : 0), 0)
    return (
        <Tile title="Digital Inputs">
            <BitFieldDisplay bitCount={din.length} value={dinValue} labels={labels} />
        </Tile>
    )
}
