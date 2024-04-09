/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { useGbdb } from "./index"

const StyledFacet = styled.div`
    text-transform: capitalize;
    font-size: 0.8em;
    font-weight: bold;
    border: 1px solid ${props => props.theme.colorBorder};
    border-radius: 4px;
    color: ${props => props.theme.colorTextTertiary};
    padding: 2px 4px;
`

export const GbDbFacetIndicator = ({
    sliceName,
    propertyName = null
}: {
    sliceName: string
    propertyName?: string
}) => {
    const { facets } = useGbdb()
    const affected_facets = Object.entries(facets).filter(([, value]) =>
        value.slices.some(
            s =>
                s.sliceName === sliceName && (!propertyName || s.properties?.includes(propertyName))
        )
    )
    if (!affected_facets.length) {
        return null
    }
    return affected_facets
        .map(([key, value]) => key)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(key => (
            <StyledFacet key={key} color="blue">
                {key}
            </StyledFacet>
        ))
}
