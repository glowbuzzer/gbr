/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

/**
 * A gbdb slice configuration defines how a slice of the store is marshalled and unmarshalled to/from a facet in the gbdb store.
 */
export type GbdbSliceConfiguration<S = any, P = any> = {
    /** The name of the slice in the store. */
    sliceName: string
    /** A list of properties of the slice that this config can affect. This is used for information only. */
    properties?: string[]
    /** A function that converts the slice state to a serializable object. It can select or manipulate a subset of the slice state. */
    marshall(sliceState: S, persistedState: P): P
    /** A function that converts a serializable object to a slice state. It should merge the given state with the existing slice state. */
    unmarshall(persistedState: P, sliceState: S): S
}
/**
 * A gbdb facet configuration defines a list of slices that are to be mapped
 */
export type GbdbFacetConfiguration = {
    [facetName: string]: {
        dependencies?: string[]
        slices: GbdbSliceConfiguration[]
    }
}
/**
 * A gbdb configuration can specify a remote database to use, and a list of facets to configure.
 */
export type GbdbConfiguration = {
    remoteDb?: boolean | string
    facets: GbdbFacetConfiguration
}
