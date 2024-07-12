/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { StateWithHistory } from "redux-undo"
import { GbdbSliceConfiguration } from "./types"
import { FlowSliceState } from "../flow"
import { GlowbuzzerConfig } from "../gbc_extra"
import { ConfigSliceState } from "../config"

export const FlowGbdbFacetSlice: GbdbSliceConfiguration<
    StateWithHistory<FlowSliceState>,
    FlowSliceState["flows"]
> = {
    sliceName: "flow",
    marshall(sliceState) {
        return sliceState.present.flows
    },
    unmarshall(persistedState) {
        const flows = persistedState || []
        return {
            present: { flows },
            past: [],
            future: []
        }
    }
}

/**
 * Factory function to create a configuration facet slice with standard behaviour
 * (handle specific single property in the config). Only interacts with the 'local' config state.
 */
function configFacetFactory<T extends keyof GlowbuzzerConfig>(
    property: T
): GbdbSliceConfiguration<Pick<ConfigSliceState, "local">, Pick<GlowbuzzerConfig, T>> {
    return {
        sliceName: "config",
        properties: [property],
        marshall(sliceState, persistedState) {
            return {
                ...persistedState,
                [property]: sliceState.local?.[property]
            }
        },
        unmarshall(persistedState, sliceState) {
            return {
                ...sliceState,
                local: {
                    ...sliceState.local,
                    ...(persistedState || { [property]: [] })
                }
            }
        }
    }
}

export const FramesGbdbFacetSlice = configFacetFactory("frames")
export const PointsGbdbFacetSlice = configFacetFactory("points")
export const ToolsGbdbFacetSlice = configFacetFactory("tool")
export const JointsGbdbFacetSlice = configFacetFactory("joint")
export const DinGbdbFacetSlice = configFacetFactory("din")
