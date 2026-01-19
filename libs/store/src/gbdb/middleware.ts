/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Middleware, Store, UnknownAction } from "@reduxjs/toolkit"
import {
    GbdbFacetConfiguration,
    gbdbLoadActionCreator,
    gbdbSlice,
    gbdbSliceNotificationAction
} from "./index"

/**
 * Convenience class to debounce updates to the gbdb slice to avoid thrashing the database.
 */
class Debounce {
    private timer: ReturnType<typeof setTimeout>

    constructor(readonly store: Pick<Store, "dispatch">) {}

    post(update: UnknownAction) {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.store.dispatch(update)
        }, 750)
    }
}

/**
 * The gbdb middleware provides two distinct functions:
 *
 * 1. Listens for actions that modify configured slices in the store, and debounces the update to the the gbdb slice.
 * This ensures that modifications to slices are reflected in facet state (which can be saved/loaded)
 *
 * 2. Listens for the load action on the gbdb slice, merges the loaded state into the store, and dispatches a generic
 * 'notification' action for each slice that might be affected. Slices can (optionally) listen for this action if they need to
 * react to changes due to loading of a facet. This is because the gbdb higher order reducer manipulates the store directly
 * which bypasses the slice reducers.
 */
export const gbdbMiddleware =
    (facets: GbdbFacetConfiguration): Middleware =>
    store => {
        // create a debounce instance for each facet (static on middleware scope)
        const debounce = Object.fromEntries(
            Object.keys(facets).map(facetName => {
                return [facetName, new Debounce(store)]
            })
        )

        return next => async (action: UnknownAction) => {
            // Note that middleware cannot affect the state directly, so we must dispatch an action to update the state

            // run the action through the reducer chain to update the state before we see it
            const result = next(action)
            const state = store.getState()

            if (gbdbLoadActionCreator.match(action)) {
                const facetName = action.payload.facetName
                // notify slices that might be affected by the load
                store.dispatch(gbdbSliceNotificationAction(facetName))
            }

            // look for actions that modify slices in our configuration and debounce the update to the gbdb slice
            for (const [facetName, config] of Object.entries(facets)) {
                const { slices: sliceConfigurations } = config
                // this assumes that slice actions are prefixed with the slice name (Redux Toolkit convention)
                const sliceNameForAction = action.type.split("/")[0]
                // facets can register multiple slice configs with the same slice name
                const affected_slices = sliceConfigurations.filter(
                    ({ sliceName }) => sliceNameForAction === sliceName
                )
                if (affected_slices.length) {
                    // call each matching slice marshall function in order
                    const update = affected_slices.reduce((acc, slice) => {
                        // merge the updates
                        return {
                            ...acc,
                            [slice.sliceName]: slice.marshall(
                                state[sliceNameForAction],
                                acc[sliceNameForAction] || {}
                            )
                        }
                    }, {})

                    // debounce the update to the gbdb slice
                    debounce[facetName].post(
                        gbdbSlice.actions.update({
                            facetName: facetName,
                            update
                        })
                    )
                }
            }
            return result
        }
    }
