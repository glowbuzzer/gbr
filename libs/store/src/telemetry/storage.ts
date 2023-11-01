/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TelemetryEntry, TelemetryPVAT, TelemetryVisibilityOptions } from "./types"

export const MAX_SAMPLES = 30000 // max number of samples we can store

// circular buffer for samples
export const telemetry_circular_buffer: TelemetryEntry[] = Array(MAX_SAMPLES)

// domains for each joint keyed by visibility option and plot type
export const telemetry_cached_domains = []

/**
 * Function to get the data point (or points) for a given view and plot. Note that this
 * function operates on a single telemetry entry, and only returns multiple values
 * when TelemetryVisibilityOptions.BOTH is specified.
 *
 * For torque, we need to add the torque and torque offsets from the set values,
 * but the act torque is already combined.
 */
export function get_telemetry_values(
    item: TelemetryEntry,
    index: number,
    view: TelemetryVisibilityOptions,
    plot: TelemetryPVAT
) {
    switch (view) {
        case TelemetryVisibilityOptions.SET:
            switch (plot) {
                case TelemetryPVAT.TORQUE:
                    return [item.set[index].t + item.set[index].to]
                default:
                    return [item.set[index][plot]]
            }
        case TelemetryVisibilityOptions.ACT:
            return [item.act[index][plot]]
        case TelemetryVisibilityOptions.BOTH:
            return [item.set[index][plot], item.act[index][plot]]
        case TelemetryVisibilityOptions.DIFF:
            return [item.set[index][plot] - item.act[index][plot]]
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
        TelemetryPVAT.TORQUE
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
                    const values = get_telemetry_values(d, i, view, plot).flat()
                    domain[0] = Math.min(domain[0], ...values)
                    domain[1] = Math.max(domain[1], ...values)
                }
            }
        }
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
        telemetry_circular_buffer[pos] = d
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
