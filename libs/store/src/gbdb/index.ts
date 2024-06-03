/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    ActionReducerMapBuilder,
    CaseReducer,
    createAction,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit"
import { NoInfer, useSelector } from "react-redux"
import { Reducer } from "react"
import deepEqual from "fast-deep-equal"

// this is how documents are persisted to PouchDB ('state' is the partial state of slices stored)
type SavedDocumentState = {
    _id: string
    _rev: string
    state: object
    references?: Record<string, string>
}

// a facet has an id (like filename), a dirty flag (modified), and the partial state of slices it relates to
export type GbdbFacetState = {
    _id?: string
    _rev?: string
    modified?: boolean
    references?: Record<string, string>
    slices: any
}

// the slice consists entirely of named facets
export type GbdbSliceState = Record<string, GbdbFacetState>

// define the reducers for the slice
type GbDbReducers = {
    create: CaseReducer<GbdbSliceState, PayloadAction<{ facetName: string }>>
    save: CaseReducer<GbdbSliceState, PayloadAction<{ facetName: string; id: string; rev: string }>>
    update: CaseReducer<GbdbSliceState, PayloadAction<{ facetName: string; update: any }>>
    load: CaseReducer<GbdbSliceState, PayloadAction<{ facetName: string; doc: SavedDocumentState }>>
    addReferences: CaseReducer<
        GbdbSliceState,
        PayloadAction<{ facetName: string; references: Record<string, string> }>
    >
}

export const gbdbSlice = createSlice<GbdbSliceState, GbDbReducers>({
    name: "gbdb",
    initialState: {},
    reducers: {
        create(state, action) {
            // facets are created on startup from the given configuration
            const { facetName } = action.payload
            state[facetName] = {
                modified: false,
                slices: {}
            }
        },
        save(state, action) {
            // the facet was saved to PouchDB, so record the id and rev
            const { facetName, id, rev } = action.payload
            const currentState = state[facetName]
            state[facetName] = {
                ...currentState,
                _id: id,
                _rev: rev,
                modified: false
            }
        },
        update(state, action) {
            // one or more underlying slices have been modified, so mark the facet as dirty
            const { facetName, update } = action.payload
            const currentState = state[facetName]
            state[facetName] = {
                ...currentState,
                slices: { ...currentState.slices, ...update },
                modified: true
            }
        },
        load(state, action) {
            // a facet was loaded from PouchDB, so overwrite the current state and mark as not dirty
            const { facetName, doc } = action.payload
            const { _id, _rev, state: slices, references } = doc
            state[facetName] = {
                _id,
                _rev,
                modified: false,
                slices,
                references
            }
        },
        addReferences(state, action) {
            // set the references for a facet
            const { facetName, references } = action.payload
            const currentState = state[facetName]
            const existing = currentState.references || {}
            const new_references = {
                ...existing,
                ...references
            }
            if (!deepEqual(existing, new_references)) {
                state[facetName] = {
                    ...currentState,
                    modified: true,
                    references: new_references
                }
            }
        }
    }
})

/**
 * An action creator used to notify regular slices that the gbdb slice has been updated.
 * Used when loading a facet from PouchDB to ensure that the slice has an opportunity to react to the
 * change, because the gbdb higher order reducer manipulates the store directly.
 */
export const gbdbSliceNotificationAction = createAction(
    "$gbdb/notification",
    (facetName: string) => ({
        payload: {
            facetName
        }
    })
)

export type GbdbSliceNotificationAction = ReturnType<typeof gbdbSliceNotificationAction>

/**
 * A helper function to create an extra reducer that listens for gbdb slice notifications and allows a slice
 * to react to changes in the store that can be causeed by the gbdb middleware.
 *
 * Example:
 * ```
 * const slice=createSlice({
 *   name: "mySlice",
 *   initialState: {
 *   },
 *   reducers: {
 *      // regular reducers
 *   },
 *   extraReducers: gbdbExtraReducersFactory<MySliceState>((state, action) => {
 *      // handle gbdb slice notification
 *   })
 * }
 * ```
 *
 * @param reducer
 */
export function gbdbExtraReducersFactory<S>(
    reducer: Reducer<S, GbdbSliceNotificationAction>
): (builder: ActionReducerMapBuilder<NoInfer<any>>) => void {
    return builder =>
        builder.addCase(gbdbSliceNotificationAction, (state: S, action) => reducer(state, action))
}

/**
 * A hook to access the gbdb facet state. Primarily used to identify facets that have been modified.
 */
export function useGbdbFacets(): GbdbSliceState {
    return useSelector((state: { gbdb: GbdbSliceState }) => state.gbdb)
}

const EMPTY_FACET: GbdbFacetState = {
    modified: false,
    slices: {}
}

export function useGbdbFacet(facetName: string): GbdbFacetState {
    return useSelector((state: { gbdb: GbdbSliceState }) => state.gbdb[facetName] || EMPTY_FACET)
}

export * from "./reducer"
export * from "./facets"
export * from "./middleware"
export * from "./reducer"
export * from "./types"
