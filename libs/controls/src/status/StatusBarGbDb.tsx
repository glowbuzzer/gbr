/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Space, Switch, Tag } from "antd"
import { useGbdbFacets } from "@glowbuzzer/store"
import styled from "styled-components"
import { useLocalStorage } from "../util/LocalStorageHook"
import { useEffect } from "react"
import { useGbdb } from ".."

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
    const [autoSave, setAutoSave] = useLocalStorage("auto.save", false)
    const facets = useGbdbFacets()
    const { facets: facetConfigs, save } = useGbdb()

    const loaded = Object.values(facets).some(f => f._id)

    useEffect(() => {
        // debounce the save
        const timer = setTimeout(() => {
            for (const [name, facet] of Object.entries(facets)) {
                const autoSaveFacet = facetConfigs[name].autoSave
                if (facet.modified && facet._id && (autoSave || autoSaveFacet)) {
                    save(name).catch(console.error)
                }
            }
        }, 1000)
        return () => clearTimeout(timer)
    }, [facets, autoSave])

    const facets_to_show = Object.entries(facets).filter(([name, state]) => {
        const config = facetConfigs[name]
        return state._id && !config.singleton
    })
    return (
        <StyledSpace>
            {facets_to_show.length > 0 && loaded && (
                <Space>
                    <Switch checked={autoSave} onChange={setAutoSave} size="small" />
                    Autosave
                </Space>
            )}
            {facets_to_show.map(([facetName, state]) => (
                <Tag className="facet" key={facetName}>
                    <span className="facet-name">{facetName}</span>
                    <span className="facet-id">{state._id || facetName}</span>
                    {state.modified && <span className="dirty">(modified)</span>}
                </Tag>
            ))}
        </StyledSpace>
    )
}
