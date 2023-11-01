/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    TelemetryVisibilityOptions,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import React, { useEffect } from "react"
import * as d3 from "d3"
import { update } from "./update"
import { useElementSize } from "./hooks"

type TelemetryChartBrushProps = {
    joints: number[]
    selected: boolean[]
    view: TelemetryVisibilityOptions
    onBrush: (v: { selection: number[] }) => void
    domain: number[]
}
/**
 * Renders a brushable chart below the primary chart when the telemetry is paused
 */
export const TelemetryChartBrush = ({
    joints,
    selected,
    view,
    onBrush,
    domain
}: TelemetryChartBrushProps) => {
    const { plot } = useTelemetrySettings()
    const { firstTimecode, lastTimecode, data, selector } = useTelemetryData()
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
        update(
            svgRef.current,
            data,
            selector,
            joints,
            selected,
            plot,
            view,
            x_domain,
            domain,
            0,
            0,
            undefined
        )
    }, [lastTimecode, joints, view, plot, domain, width, height])

    // the brushable chart is the `g` element of the svg, and we reduce the width by the right axis margin
    return (
        <svg className="brush" ref={svgRef} width={Math.max(width - 30, 0)}>
            <g className="brush" />
        </svg>
    )
}
