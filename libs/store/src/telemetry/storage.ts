/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TelemetryEntry,
    TelemetryEntryWithEdges,
    TelemetryIoEdges,
    TelemetryPVAT,
    TelemetrySelector,
    TelemetryVisibilityOptions
} from "./types"

export const MAX_SAMPLES = 30000 // max number of samples we can store

// circular buffer for samples
export const telemetry_circular_buffer: TelemetryEntryWithEdges[] = Array(MAX_SAMPLES)

// domains for each joint keyed by visibility option and plot type
export const telemetry_cached_domains = []

/**
 * @internal to the telemetry module
 */
export const get_telemetry_values_joints: TelemetrySelector = (
    item: TelemetryEntry,
    selectionIndex: number,
    view: TelemetryVisibilityOptions,
    plot: TelemetryPVAT
): number[] => {
    switch (view) {
        case TelemetryVisibilityOptions.SET:
            switch (plot) {
                case TelemetryPVAT.TORQUE:
                    return [item.set[selectionIndex].t + item.set[selectionIndex].to]
                default:
                    return [item.set[selectionIndex][plot]]
            }
        case TelemetryVisibilityOptions.ACT:
            return [item.act[selectionIndex][plot]]
        case TelemetryVisibilityOptions.BOTH:
            switch (plot) {
                case TelemetryPVAT.TORQUE:
                    return [
                        item.set[selectionIndex].t + item.set[selectionIndex].to,
                        item.act[selectionIndex].t
                    ]
                default:
                    return [item.set[selectionIndex][plot], item.act[selectionIndex][plot]]
            }
        case TelemetryVisibilityOptions.DIFF:
            return [item.set[selectionIndex][plot] - item.act[selectionIndex][plot]]
    }
}

export function reset_telemetry_state(state: {
    start: number
    count: number
    lastCapture: TelemetryEntry
}) {
    state.start = 0
    state.count = 0
    state.lastCapture = null
    // reset the domains
    telemetry_cached_domains.length = 0
}

/**
 * We keep a cached domain for each joint, plot, and view. This function updates these cached
 * values. This is to avoid having to iterate over the entire buffer every time we want to
 * know the domain.
 *
 * @param items The new entries being added to the buffer, for which we need to update the domains
 */
function update_telemetry_domains(items: TelemetryEntry[]) {
    // cross product of all the possible combinations of plot and view
    for (const plot of [
        TelemetryPVAT.POS,
        TelemetryPVAT.VEL,
        TelemetryPVAT.ACC,
        TelemetryPVAT.TORQUE,
        TelemetryPVAT.CONTROL_EFFORT
    ]) {
        for (const view of [
            TelemetryVisibilityOptions.SET,
            TelemetryVisibilityOptions.ACT,
            TelemetryVisibilityOptions.BOTH,
            TelemetryVisibilityOptions.DIFF
        ]) {
            for (const d of items) {
                const len = d.set.length // act len will be the same
                for (let i = 0; i < len; i++) {
                    const j_domain = (telemetry_cached_domains[i] ??= {})
                    const p_domain = (j_domain[plot] ??= {})
                    const domain = (p_domain[view] ??= [
                        Number.POSITIVE_INFINITY,
                        Number.NEGATIVE_INFINITY
                    ])
                    const values = get_telemetry_values_joints(d, i, view, plot).flat()
                    domain[0] = Math.min(domain[0], ...values)
                    domain[1] = Math.max(domain[1], ...values)
                }
            }
        }
    }
}

function derive_edges(count: number, d: TelemetryEntry, prev: number): TelemetryIoEdges {
    if (count === 0) {
        return {
            di: [0, 0],
            do: [0, 0],
            sdi: [0, 0],
            sdo: [0, 0]
        }
    }
    const {
        di: prev_di,
        do: prev_do,
        sdi: prev_sdi,
        sdo: prev_sdo
    } = telemetry_circular_buffer[prev]
    const { di: curr_di, do: curr_do, sdi: curr_sdi, sdo: curr_sdo } = d

    function compare_edges(prev: number, curr: number, falling: boolean) {
        let result = 0
        for (let n = 0; n < 16; n++) {
            const mask = 1 << n
            if (falling) {
                if (prev & mask && !(curr & mask)) {
                    result |= mask
                }
            } else {
                if (!(prev & mask) && curr & mask) {
                    result |= mask
                }
            }
        }
        return result
    }

    return {
        di: [compare_edges(prev_di, curr_di, false), compare_edges(prev_di, curr_di, true)],
        do: [compare_edges(prev_do, curr_do, false), compare_edges(prev_do, curr_do, true)],
        sdi: [compare_edges(prev_sdi, curr_sdi, false), compare_edges(prev_sdi, curr_sdi, true)],
        sdo: [compare_edges(prev_sdo, curr_sdo, false), compare_edges(prev_sdo, curr_sdo, true)]
    }
}

/**
 * Append telemetry items to the circular buffer. This function also updates the cached
 * domains for each joint, plot, and view.
 */
export function append_telemetry_items(
    state: { start: number; count: number },
    items: TelemetryEntry[]
) {
    const count = items.length
    items.forEach((d, index) => {
        const pos = (state.start + state.count + index) % MAX_SAMPLES
        const prev = (pos + MAX_SAMPLES - 1) % MAX_SAMPLES
        const edges = derive_edges(state.count, d, prev)
        telemetry_circular_buffer[pos] = {
            ...d,
            e: edges
        }
    })
    const new_count = state.count + count
    if (new_count >= MAX_SAMPLES) {
        const overflow = new_count - MAX_SAMPLES
        state.start = (state.start + overflow) % MAX_SAMPLES
        state.count = MAX_SAMPLES
    } else {
        state.count = new_count
    }

    update_telemetry_domains(items)
}
