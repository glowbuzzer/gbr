/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {BitFieldDisplay} from "../dro"
import {useDigitalInputBits, useDigitalInputList} from "@glowbuzzer/store"
import {StyledTileContent} from "../util/styles/StyledTileContent"

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
