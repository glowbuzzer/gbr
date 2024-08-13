/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { useEffect, useState } from "react"
// import PouchDB from "pouchdb"
import { useDispatch, useSelector, useStore } from "react-redux"
import {
    GbdbConfiguration,
    GbdbFacetConfiguration,
    gbdbLoadActionCreator,
    gbdbSlice,
    RootState
} from "@glowbuzzer/store"
import { useGbdbDebugHelper } from "./debug"
import { useConnectionUrls } from "../app/hooks"

export type GbdbItem = PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta

type GbdbContextType = {
    facets: GbdbFacetConfiguration
    list(facetName: string): Promise<GbdbItem[]>
    open(facetName: string, id: string): Promise<void>
    remove(facetName: string, item: GbdbItem): Promise<void>
    save(facetName: string): Promise<void>
    saveAs(facetName: string, id: string): Promise<void>
}

const gbdbContext = React.createContext<GbdbContextType>(null)

type GbdbProviderProps = {
    configuration?: GbdbConfiguration
    children: React.ReactNode
}

export const GbdbProvider = ({ configuration = { facets: {} }, children }: GbdbProviderProps) => {
    // use store and store.getState() rather than a selector on the entire state to avoid re-rendering on every state change
    const store = useStore<RootState>()
    const { pouchDbBase } = useConnectionUrls()
    const dispatch = useDispatch()
    const { facets } = configuration
    const gbdb = useSelector((state: RootState) => state.gbdb)
    const [databases, setDatabases] = useState<{
        [p: string]: PouchDB.Database<{ state: object }>
    }>({})

    function validate_facet(facetName: string) {
        if (!facets[facetName]) {
            throw new Error("Unknown facet: " + facetName)
        }
    }

    useEffect(() => {
        if (Object.keys(configuration.facets).length > 0) {
            // hack to keep PouchDB happy
            window.global = window

            // dynamic import pouchdb
            import("pouchdb")
                .then(PouchDB => {
                    // create a PouchDB instance for each facet
                    setDatabases(
                        Object.fromEntries(
                            Object.keys(facets).map(facetName => {
                                return [
                                    facetName,
                                    new PouchDB.default<{ state: object }>(
                                        `${pouchDbBase}${facetName}`
                                    )
                                ]
                            })
                        )
                    )
                })
                .catch(err => {
                    console.error(
                        "Failed to load PouchDB. Have you included it in your package.json, and have you added 'events' module?",
                        err
                    )
                })
        }
    }, [configuration])

    // hook to add import and export to window.gbdb (useful during development to exchange facet state)
    useGbdbDebugHelper(gbdb, databases)

    useEffect(() => {
        // create empty facets on mount
        for (const [facetName] of Object.entries(facets)) {
            dispatch(gbdbSlice.actions.create({ facetName }))
        }
    }, [])

    /**
     * Save the current state of a facet to the database
     */
    async function save(facetName: string, id: string = undefined) {
        validate_facet(facetName)

        const state = store.getState()

        const db = databases[facetName]
        const sliceConfig = facets[facetName]

        const gbdbState = state.gbdb
        const facetState = gbdbState[facetName]

        const { slices, modified, ...doc } = facetState
        if (!id && !doc._id) {
            throw new Error("Attempt to save without id and no existing doc id")
        }

        if (!id && !modified) {
            return
        }

        // marshall the state of each slice into a new object that will be saved to the database
        const updateState = sliceConfig.slices.reduce((acc, { sliceName, marshall }) => {
            const sliceState = marshall(state[sliceName], acc[sliceName])
            return {
                ...acc,
                [sliceName]: sliceState
            }
        }, {})

        // console.log("save doc", updateState, facetState)
        const _rev = await new Promise<string>(resolve => {
            const lookup = id || doc._id
            if (lookup) {
                db.get(lookup)
                    .then(doc => {
                        resolve(doc._rev)
                    })
                    .catch(() => {
                        // doc doesn't exist so we'll create new
                        resolve(undefined)
                    })
            } else {
                resolve(undefined)
            }
        })

        // post new doc or put existing doc
        const response = id
            ? await db.post({
                  ...doc,
                  _id: id,
                  _rev,
                  state: updateState,
                  references: facetState.references
              })
            : await db.put({
                  ...doc, // contains _id
                  _rev,
                  state: updateState,
                  references: facetState.references
              })

        // update our slice
        dispatch(
            gbdbSlice.actions.save({
                facetName,
                id: response.id,
                rev: response.rev
            })
        )
    }

    async function open(facetName: string, id: string) {
        validate_facet(facetName)

        const db = databases[facetName]
        if (!db) {
            throw new Error("Invalid facet name: " + facetName)
        }
        const doc = await db.get<{ state: any; references?: Record<string, string> }>(id)
        // spread state into the store (handled by the gbdb reducer)
        // console.log("dispatching gbdbLoadActionCreator", doc.state)
        dispatch(gbdbLoadActionCreator(facetName, doc.state))
        // dispatch to our slice
        dispatch(gbdbSlice.actions.load({ facetName, doc }))

        // check for any facets that reference the one being loaded
        for (const [referencing_facet_name, facet] of Object.entries(facets)) {
            if (facet.dependencies?.includes(facetName)) {
                // if the facet has a dependency on the one being loaded, update the references
                dispatch(
                    gbdbSlice.actions.addReferences({
                        facetName: referencing_facet_name,
                        references: {
                            // will be merged with any existing references
                            [facetName]: id
                        }
                    })
                )
            }
        }
        // do the same recursively for any referenced facets
        const { references } = doc
        if (references) {
            for (const [ref_facet_name, ref_id] of Object.entries(references)) {
                await open(ref_facet_name, ref_id)
            }
        }
    }

    useEffect(() => {
        for (const [facetName, facet] of Object.entries(facets)) {
            if (facet.singleton) {
                open(facetName, "Default").catch(err => {
                    if (err.status === 404) {
                        save(facetName, "Default").catch(console.error)
                    }
                })
            }
        }
    }, [facets])

    const context: GbdbContextType = {
        facets,
        /**
         * Save the current state of a facet to the database
         */
        save,
        /**
         * Load a facet and spread state into the store.
         */
        open,
        /**
         * List all documents for given facet
         */
        async list(facetName: string) {
            validate_facet(facetName)

            const db = databases[facetName]
            if (!db) {
                throw new Error("Invalid facet name: " + facetName)
            }
            const response = await db.allDocs({ include_docs: false })
            return response.rows.map(r => {
                return {
                    _id: r.id,
                    _rev: r.value.rev
                }
            })
        },
        /**
         * Remove a document from the database.
         */
        async remove(facetName: string, item: GbdbItem) {
            validate_facet(facetName)

            const db = databases[facetName]
            await db.remove({
                _id: item._id,
                _rev: item._rev
            })
        },
        async saveAs(facetName: string, id: string) {
            await save(facetName, id)
        }
    }

    return <gbdbContext.Provider value={context}>{children}</gbdbContext.Provider>
}

export function useGbdb() {
    const context = React.useContext(gbdbContext)
    if (!context) {
        throw new Error("useGbdb must be used within a GbdbProvider")
    }
    return context
}
