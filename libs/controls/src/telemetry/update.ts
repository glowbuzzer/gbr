/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TelemetryEntry,
    TelemetryEntryWithEdges,
    TelemetryGenerator,
    TelemetryPVAT,
    TelemetrySelector,
    TelemetryVisibilityOptions,
    TRIGGERTYPE
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

const labels = {
    di: "input",
    do: "output",
    sdi: "safety input",
    sdo: "safety output"
}

const bits = Array.from({ length: 16 }, (_, i) => i)

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
    includeEdgeLabels: boolean,
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

    const joint_line = d3
        .line<{ t: number; value: number }>()
        .x(d => x_scale(d.t))
        .y(d => y_scale(d.value))

    const joints_to_render = joints
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

    const joint_lines = svg
        .selectAll<SVGPathElement, unknown>(".joint")
        .data(joints_to_render, (r: (typeof joints_to_render)[0]) => `${r.jointNum}-${r.key}`)

    joint_lines
        .enter()
        .append("path")
        .attr("class", "joint line")
        .attr("stroke", r => r.color)
        .attr("stroke-dasharray", r => r.dashArray)
        .merge(joint_lines)
        .attr("d", r => {
            const lineData = selected_data.map(d => {
                const value = r.value(d)
                return {
                    t: d.t,
                    value
                }
            })
            return joint_line(lineData)
        })
    joint_lines.exit().remove()

    const edges = selected_data.filter(d => {
        return Object.values(d.e).some(v => v.some(e => e > 0))
    })

    const edge_lines = svg
        .selectAll<SVGGElement, unknown>(".edge")
        .data(edges, (r: TelemetryEntryWithEdges) => `${r.t}`)
    edge_lines.exit().remove()

    const edge_line_enter = edge_lines.enter().append("g").attr("class", "edge")

    const edge_top = 5
    const edge_bottom = el.clientHeight - margin - 5
    function type_filter(type: TRIGGERTYPE) {
        return (d: TelemetryEntryWithEdges) => Object.values(d.e).some(v => v[type as number] > 0)
    }

    function edge(type: TRIGGERTYPE) {
        const rising = type === TRIGGERTYPE.TRIGGERTYPE_RISING
        edge_line_enter
            .filter(type_filter(type))
            .append("path")
            .attr("class", `edge-line-${type}`)
            .attr("stroke", r => "grey")
            .attr(
                "d",
                `M${rising ? 10 : -10},${edge_top} L0,${edge_top} L0,${edge_bottom} L${
                    rising ? -10 : 10
                },${edge_bottom}`
            )
    }
    edge(TRIGGERTYPE.TRIGGERTYPE_RISING)
    edge(TRIGGERTYPE.TRIGGERTYPE_FALLING)

    if (includeEdgeLabels) {
        function label(type: TRIGGERTYPE) {
            const rising = type === TRIGGERTYPE.TRIGGERTYPE_RISING
            const text_node = edge_line_enter
                .filter(d => Object.values(d.e).some(v => v[type as number] > 0))
                .append("g")
                .attr("class", "edge-text")
                .attr("transform", `translate(14, ${rising ? 10 : el.clientHeight - margin - 10})`)
                .append("g")
                .attr("transform", "rotate(-90)")

            text_node.each(d => {
                // const text = d3.select(this)
                const data_items = Object.entries(d.e).filter(([k, v]) => v[type as number] > 0)

                for (const [index, [key, value]] of Object.entries(data_items)) {
                    const indexes = bits.filter(n => value[type as number] & (1 << n)).join(", ")
                    text_node
                        .append("text")
                        .attr("text-anchor", rising ? "end" : "start")
                        .attr("fill", "grey")
                        .attr("y", Number(index) * 14)
                        .text(`${labels[key]} ${indexes}`)
                }
            })
        }
        label(TRIGGERTYPE.TRIGGERTYPE_RISING)
        label(TRIGGERTYPE.TRIGGERTYPE_FALLING)
    }

    edge_lines
        .merge(edge_line_enter)
        .attr("transform", d => `translate(${x_scale(d.t)}, 0)`)
        .select(".edge-line")

    return [x_scale, y_scale]
}
