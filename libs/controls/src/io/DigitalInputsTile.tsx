/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { BitFieldDisplay } from "../dro"
import { useDigitalInputBits, useDigitalInputList } from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"

export const DigitalInputsTileHelp = () => (
    <div>
        <h4>Digital Inputs Tile</h4>
        <p>The Digital Inputs Tile shows the "live" value of all of the digital inputs</p>
        <p>that have been configured for a machine.</p>
    </div>
)

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
    const dins = useDigitalInputList()
    const bits = useDigitalInputBits()

    const normalised_labels = dins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )

    return (
        <StyledTileContent>
            {dins && (
                <BitFieldDisplay bitCount={dins.length} value={bits} labels={normalised_labels} />
            )}
        </StyledTileContent>
    )
}
