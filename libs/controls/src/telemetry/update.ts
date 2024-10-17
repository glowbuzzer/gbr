/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */

import { TelemetryEntryWithEdges, TelemetryGenerator, TRIGGERTYPE } from "@glowbuzzer/store"
import * as d3 from "d3"
import { TelemetrySeries } from "./types"

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
    series: TelemetrySeries[],
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

    const data_range = Array.from(data([from, to]))

    const line = d3
        .line<{ t: number; value: number }>()
        .x(d => x_scale(d.t))
        .y(d => y_scale(d.value))

    const lines = svg
        .selectAll<SVGPathElement, unknown>(".series")
        .data(series, (r: TelemetrySeries) => r.key)

    lines
        .enter()
        .append("path")
        .attr("class", "series line")
        .attr("stroke", r => axis_colors[r.colourIndex])
        .attr("stroke-dasharray", r => (r.secondary ? "2,2" : ""))
        .merge(lines)
        .attr("d", r => {
            const lineData = data_range.map((item, index, arr) => {
                const value = r.value(item, index, arr)
                return {
                    t: item.t,
                    value
                }
            })
            return line(lineData)
        })
    lines.exit().remove()

    const edges = data_range.filter(d => {
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
            .attr("stroke", "grey")
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
                const data_items = Object.entries(d.e).filter(([_, v]) => v[type as number] > 0)

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
