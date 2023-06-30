/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { BitFieldDisplay } from "../dro"
import { useDigitalInputBits, useDigitalInputList, useDigitalInputs } from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { Tag } from "antd"

import styled from "styled-components"

const StyledDigitalInput = styled.div`
    display: flex;
    padding: 1px 0;
    .label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

type DigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital inputs tile shows a simple view of all current digital input values.
 */
export const DigitalInputsTile = ({ labels = [] }: DigitalInputsTileProps) => {
    const dins = useDigitalInputList()
    const values = useDigitalInputs()

    const normalised_labels = dins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )

    return (
        <StyledTileContent>
            {dins &&
                dins.map((config, index) => (
                    <StyledDigitalInput>
                        <span className="label">{normalised_labels[index]}</span>
                        <Tag color={values[index] ? "green" : "red"}>
                            {values[index] ? "ON" : "OFF"}
                        </Tag>
                    </StyledDigitalInput>
                ))}
        </StyledTileContent>
    )
}
