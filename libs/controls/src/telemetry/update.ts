/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TelemetryEntry,
    TelemetryGenerator,
    TelemetryPVAT,
    TelemetrySelector,
    TelemetryVisibilityOptions
} from "@glowbuzzer/store"
import * as d3 from "d3"

export const axis_colors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#444444"
]
export function update(
    el: SVGSVGElement,
    data: TelemetryGenerator,
    selector: TelemetrySelector,
    joints: number[],
    selected: boolean[],
    plot: TelemetryPVAT,
    view: TelemetryVisibilityOptions,
    x_domain: number[],
    y_domain: number[],
    margin: number,
    from: number,
    to?: number
) {
    const svg = d3.select(el)

    const x_scale = d3
        .scaleLinear()
        .domain(x_domain)
        .range([0, el.clientWidth - margin])

    const y_scale = d3
        .scaleLinear()
        .domain(y_domain)
        .range([el.clientHeight - margin, 0])

    const selected_data = Array.from(data([from, to]))

    const line = d3
        .line<{ t: number; value: number }>()
        .x(d => x_scale(d.t))
        .y(d => y_scale(d.value))

    const render = joints
        .map((jointNum, index) => {
            const color = axis_colors[index]
            switch (view) {
                case TelemetryVisibilityOptions.BOTH:
                    return [
                        {
                            key: TelemetryVisibilityOptions.SET,
                            jointNum,
                            select: 0,
                            color,
                            dashArray: undefined
                        },
                        {
                            key: TelemetryVisibilityOptions.ACT,
                            jointNum,
                            select: 1,
                            color,
                            dashArray: "2,2"
                        }
                    ]
                case TelemetryVisibilityOptions.ACT:
                    return [
                        {
                            key: TelemetryVisibilityOptions.ACT,
                            jointNum,
                            select: 0,
                            color,
                            dashArray: "2,2"
                        }
                    ]
                default:
                    return [{ key: view, jointNum, select: 0, color, dashArray: "" }]
            }
        })
        .filter((_, i) => selected[i])
        .flat()
        .map(v => ({
            ...v,
            value: (e: TelemetryEntry) => selector(e, v.jointNum, view, plot)[v.select]
        }))

    const lines = svg
        .selectAll(".line")
        .data(render, (r: (typeof render)[0]) => `${r.jointNum}-${r.key}`)
    // noinspection JSUnresolvedReference
    lines
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("stroke", r => r.color)
        .attr("stroke-dasharray", r => r.dashArray)
        .merge(lines as any)
        .attr("d", r => {
            const lineData = selected_data.map(d => {
                const value = r.value(d)
                return {
                    t: d.t,
                    value
                }
            })
            return line(lineData)
        })

    lines.exit().remove()

    return [x_scale, y_scale]
}
