/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Space, Tag } from "antd"
import { useGbdbFacets } from "@glowbuzzer/store"
import styled from "styled-components"

const StyledSpace = styled(Space)`
    .facet {
        display: flex;
        gap: 4px;

        .facet-name {
            text-transform: capitalize;
        }
        .dirty {
            color: ${props => props.theme.colorTextTertiary};
        }
    }
`

export const StatusBarGbDb = () => {
    const facets = useGbdbFacets()

    return (
        <StyledSpace>
            {Object.entries(facets)
                .filter(([, state]) => state._id)
                .map(([facetName, state]) => (
                    <Tag className="facet" key={facetName}>
                        <span className="facet-name">{facetName}</span>
                        <span className="facet-id">{state._id || facetName}</span>
                        {state.modified && <span className="dirty">(modified)</span>}
                    </Tag>
                ))}
        </StyledSpace>
    )
}
