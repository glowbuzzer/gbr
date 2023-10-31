/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import {
    CaptureState,
    KinematicsConfigurationConfig,
    TelemetryGenerator,
    TelemetryPVAT,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import styled from "styled-components"
import { TelemetryVisibilityOptions } from "@glowbuzzer/controls"

const StyledDiv = styled.div`
    .main {
        //background: blue;
    }

    .brush {
        //background: green;
    }

    path {
        stroke-width: 2;
        fill: none;
    }
`

const colors = d3.schemeCategory10 // For different line colors

const width = 800
const height = 300

function update(
    el: SVGSVGElement,
    data: TelemetryGenerator,
    x_domain: number[],
    y_domain: number[],
    from: number,
    to?: number
) {
    const svg = d3.select(el)

    const x_scale = d3.scaleLinear().domain(x_domain).range([0, el.clientWidth])
    const y_scale = d3.scaleLinear().domain(y_domain).range([el.clientHeight, 0])

    const keys = [0]

    const line = d3
        .line<{ t: number; value: number }>()
        .x(d => x_scale(d.t))
        .y(d => y_scale(d.value))

    const lines = svg.selectAll(".line").data(keys, key => key as number)
    // noinspection JSUnresolvedReference
    lines
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("stroke", (_key, index) => colors[index])
        .merge(lines as any)
        .attr("d", key => {
            const lineData = Array.from(data([from, to], d => ({ t: d.t, value: d.set[key].p })))
            return line(lineData)
        })

    lines.exit()
}

type SparklineMainProps = {
    width: number
    height: number
    domain: number[]
    brush: number[]
}
export const SparklineMain = ({ width, height, domain, brush }: SparklineMainProps) => {
    const { captureDuration } = useTelemetryControls()
    const { firstTimecode, lastTimecode, data, count } = useTelemetryData()
    const svgRef = useRef<SVGSVGElement>(null)

    const clientHeight = svgRef.current?.clientHeight
    const clientWidth = svgRef.current?.clientWidth

    useEffect(() => {
        if (brush) {
            const x_domain = brush.map((v: number) =>
                Math.floor((v / clientWidth) * (lastTimecode - firstTimecode) + firstTimecode)
            )
            const [from, to] = brush.map(v => Math.floor((v / clientWidth) * count))
            update(svgRef.current, data, x_domain, domain, from, to)
        } else {
            const x_domain = [Math.max(0, lastTimecode - captureDuration), lastTimecode]
            const from = -captureDuration
            update(svgRef.current, data, x_domain, domain, from)
        }
    }, [firstTimecode, lastTimecode, clientHeight, clientWidth, brush, captureDuration])

    return <svg className="main" ref={svgRef} width={width} height={height}></svg>
}

export const SparklineBrush = ({ onBrush, domain }) => {
    const { firstTimecode, lastTimecode, data } = useTelemetryData()
    const svgRef = useRef<SVGSVGElement>(null)

    const width = 800
    const height = 50

    useEffect(() => {
        const brush = d3
            .brushX()
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("brush end", onBrush)

        d3.select(svgRef.current).selectAll(".brush").call(brush)
    }, [onBrush])

    useEffect(() => {
        const x_domain = [firstTimecode, lastTimecode]

        update(svgRef.current, data, x_domain, domain, 0)
    }, [lastTimecode])

    // noinspection JSUnresolvedReference
    return (
        <svg className="brush" ref={svgRef} width={width} height={height}>
            <g className="brush" />
        </svg>
    )
}

type Sparkline2Props = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    view: TelemetryVisibilityOptions
    selected: boolean[]
}
export const Sparkline2 = ({ kinematicsConfiguration, view, selected }: Sparkline2Props) => {
    const { captureState, plot } = useTelemetryControls()
    const { data, count, lastTimecode } = useTelemetryData()
    const [brush, setBrush] = React.useState(null)
    const [domain, setDomain] = useState([0, 0])

    useEffect(() => {
        const values = Array.from(
            data([0, count], d => {
                return kinematicsConfiguration.participatingJoints
                    .map<number>(index => {
                        switch (view) {
                            case TelemetryVisibilityOptions.SET:
                                switch (plot) {
                                    case TelemetryPVAT.TORQUE:
                                        return d.set[index].t + d.set[index].to
                                    default:
                                        return [d.set[index][plot]]
                                }
                            case TelemetryVisibilityOptions.ACT:
                                return d.act[index][plot]
                            case TelemetryVisibilityOptions.BOTH:
                                return [d.set[index][plot], d.act[index][plot]]
                            case TelemetryVisibilityOptions.DIFF:
                                return d.set[index][plot] - d.act[index][plot]
                        }
                    })
                    .filter((_, i) => selected[i])
                    .flat()
            })
        ).flat()
        const domain = d3.extent(values).sort()
        console.log("set domain", domain, values)
        setDomain(domain)
    }, [lastTimecode])

    function update_brush(v: { selection: number[] }) {
        console.log(v.selection)
        setBrush(v.selection)
    }

    const show_brush = captureState === CaptureState.PAUSED && count > width
    return (
        <StyledDiv>
            <SparklineMain
                width={width}
                height={height - (show_brush ? 100 : 0)}
                brush={brush}
                domain={domain}
            />
            {show_brush && <SparklineBrush onBrush={update_brush} domain={domain} />}
        </StyledDiv>
    )
}
