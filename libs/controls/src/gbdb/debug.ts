/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { gbdbLoadActionCreator, gbdbSlice, GbdbSliceState } from "@glowbuzzer/store"
import PouchDB from "pouchdb"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

/**
 * Used during development to export and import gbdb facet state
 */

export function useGbdbDebugHelper(
    gbdb: GbdbSliceState,
    databases: { [p: string]: PouchDB.Database<{ state: object }> }
) {
    const dispatch = useDispatch()

    useEffect(() => {
        const state = Object.fromEntries(
            Object.entries(gbdb)
                .sort((a, b) => {
                    if (a[1].references?.[b[0]]) {
                        return 1 // a references b, so a should come after b
                    }
                    return -1
                })
                .map(([facetName, facet]) => {
                    const { slices, _id, references } = facet
                    return [
                        facetName,
                        {
                            _id,
                            slices,
                            references
                        }
                    ]
                })
        )

        function load(state: { [key: string]: any }) {
            for (const [facetName, facet] of Object.entries(state)) {
                dispatch(gbdbLoadActionCreator(facetName, facet.slices))
                dispatch(gbdbSlice.actions.load({ facetName, doc: facet }))
            }
        }
        ;(window as any).gbdb = { export: () => state, import: load }
    }, [gbdb, databases, dispatch])
}
