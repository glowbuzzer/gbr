/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useTelemetryControls, useTelemetryData } from "@glowbuzzer/store"
import { useElementSize } from "./hooks"
import React, { useEffect } from "react"
import { update } from "./update"
import * as d3 from "d3"
import { TelemetrySeries } from "./types"

type TelemetryChartGenericProps = {
    series: TelemetrySeries[]
    domain: number[]
    brush?: number[]
}

export const TelemetryChartPrimary = ({ series, domain, brush }: TelemetryChartGenericProps) => {
    const { captureDuration } = useTelemetryControls()
    const { firstTimecode, lastTimecode, data, count } = useTelemetryData()
    const [svgRef, width, height] = useElementSize<SVGSVGElement>()

    useEffect(() => {
        function exec_update(x_domain: number[], from: number, to: number) {
            const [x_scale, y_scale] = update(
                svgRef.current,
                data,
                series,
                x_domain,
                domain,
                30,
                true,
                from,
                to
            )
            const axes = [d3.axisBottom(x_scale).ticks(4), d3.axisRight(y_scale).ticks(4)]

            const svg = d3.select(svgRef.current)
            svg.selectAll(".axis").each(function (_, i) {
                const selection = d3.select(this)
                selection
                    .transition()
                    .duration(100)
                    // @ts-ignore
                    .call(axes[i])
            })
        }

        if (brush) {
            const x_domain = brush.map((v: number) =>
                Math.floor((v / width) * (lastTimecode - firstTimecode) + firstTimecode)
            )
            const [from, to] = brush.map(v => Math.floor((v / width) * count))
            exec_update(x_domain, from, to)
        } else {
            const x_domain = [Math.max(0, lastTimecode - captureDuration), lastTimecode]
            const from = -captureDuration
            exec_update(x_domain, from, undefined)
        }
    }, [firstTimecode, lastTimecode, width, height, brush, captureDuration, domain, series])

    return (
        <svg className="main" ref={svgRef}>
            <g className="x axis" />
            <g className="y axis" />
        </svg>
    )
}
