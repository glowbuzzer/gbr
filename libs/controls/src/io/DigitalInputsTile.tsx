import React from "react"
import { useDigitalInputs } from "@glowbuzzer/store"
import { Tile } from "../tiles"
import { BitFieldDisplay } from "../dro"

type DigitalInputsTileProps = {
    /**
     * Labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital inputs tile shows a simple view of all current digital input values.
 */
export const DigitalInputsTile = ({ labels = [] }: DigitalInputsTileProps) => {
    const din = useDigitalInputs()

    const dinValue = din.reduce((value, current, index) => value | (current ? 1 << index : 0), 0)
    return (
        <Tile title="Digital Inputs">
            <BitFieldDisplay bitCount={din.length} value={dinValue} labels={labels} />
        </Tile>
    )
}
