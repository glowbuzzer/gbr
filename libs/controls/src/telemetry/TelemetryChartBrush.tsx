/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */

import { useTelemetryData } from "@glowbuzzer/store"
import React, { useEffect } from "react"
import * as d3 from "d3"
import { update } from "./update"
import { useElementSize } from "./hooks"
import { TelemetrySeries } from "./types"

type TelemetryChartBrushProps = {
    series: TelemetrySeries[]
    onBrush: (v: { selection: number[] }) => void
    domain: number[]
}
/**
 * Renders a brushable chart below the primary chart when the telemetry is paused
 */
export const TelemetryChartBrush = ({ series, onBrush, domain }: TelemetryChartBrushProps) => {
    const { firstTimecode, lastTimecode, data } = useTelemetryData()
    const [svgRef, width, height] = useElementSize<SVGSVGElement>()

    useEffect(() => {
        // re-create the brushed area when the size or callback changes
        const brush = d3
            .brushX()
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("brush end", onBrush)

        const el = d3.select(svgRef.current).selectAll(".brush")
        el.call(brush)
    }, [onBrush, width, height])

    useEffect(() => {
        // render the brushable chart when the data or size changes
        // here we will render all the available data
        const x_domain = [firstTimecode, lastTimecode]
        update(svgRef.current, data, series, x_domain, domain, 0, false, 0, undefined)
    }, [lastTimecode, series, domain, width, height])

    // the brushable chart is the `g` element of the svg, and we reduce the width by the right axis margin
    return (
        <svg className="brush" ref={svgRef} width={Math.max(width - 30, 0)}>
            <g className="brush" />
        </svg>
    )
}
