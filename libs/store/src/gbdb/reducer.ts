/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createAction, Reducer } from "@reduxjs/toolkit"
import { GbdbFacetConfiguration } from "./types"

/**
 * Action creator to load a facet state from the database into the store.
 * Dispatched when a facet is opened/loaded, and handled by the gbdb higher order reducer.
 */
export const gbdbLoadActionCreator = createAction(
    "$gbdb/load",
    (facetName: string, loadedState: any) => ({
        payload: {
            facetName,
            loadedState
        }
    })
)

/**
 * Higher order reducer factory that wraps a given reducer and listens for gbdb load actions.
 * @param facets The gbdb facet configuration
 * @param reducer The reducer to wrap (the combined Redux reducer)
 */
export function gbdbHigherOrderReducerFactory<S>(
    facets: GbdbFacetConfiguration,
    reducer: Reducer<S>
): Reducer<S> {
    return (state, action) => {
        if (gbdbLoadActionCreator.match(action)) {
            const { facetName, loadedState } = action.payload
            const config = facets[facetName]
            if (!config) {
                console.warn("No configuration found for persistent facet:", facetName)
                return state
            }
            // console.log("loaded state", loadedState)
            // unmarshall the loaded state into the store for each configured slice
            // there might be multiple slices with the same name, so we need to merge
            // we reverse the order of slices, to mirror the order they were marshalled
            return config.slices
                .slice(0) // copy
                .reverse() // reverse
                .reduce((acc, { sliceName, unmarshall }) => {
                    const merged_slice = unmarshall(loadedState[sliceName], acc[sliceName])
                    // console.log("merged slice", sliceName, merged_slice)
                    return {
                        ...acc,
                        [sliceName]: merged_slice
                    }
                }, state)
        }
        return reducer(state, action)
    }
}
