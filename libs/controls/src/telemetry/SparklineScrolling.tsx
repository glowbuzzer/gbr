import * as React from "react"
import * as d3 from "d3"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useTelemetry } from "@glowbuzzer/store"
import styled from "styled-components"

export const SparklineScrolling = styled(({ ...props }) => {
    // const data = []
    const height = 200
    const xmargin = 20
    const ymargin = 20
    const duration = 500
    const scaleRef = useRef(null)
    const axisRef = useRef(null)
    const elemRef = useRef<HTMLDivElement>(null)
    const telemetry = useTelemetry()
    const [width, setWidth] = useState(800)

    // const now = useRef(0)

    // let start_time = time - duration * 2 - time_frame

    useEffect(() => {
        function resize(e: ResizeObserverEntry[]) {
            if (e.length) {
                const { width } = e[0].contentRect
                setWidth(width)
            }
        }

        const elem = elemRef.current
        const observer = new ResizeObserver(resize)
        observer.observe(elem)
        return () => observer.disconnect()
    }, [])

    useLayoutEffect(() => {
        const xScale = d3
            .scaleLinear()
            .domain([0, 500])
            // .domain([time + duration, time - duration * 2 - time_frame])
            //    .domain([time - duration, start_time + duration])
            .range([0, width - xmargin * 2])
        const yScale = d3
            .scaleLinear()
            .domain([-100, 100])
            .range([height - ymargin * 2, 0])

        scaleRef.current = {
            xScale,
            yScale
        }

        const xAxis = d3.axisBottom(xScale).ticks(4)
        const yAxis = d3.axisRight(yScale).ticks(4)

        axisRef.current = {
            xAxis,
            yAxis
        }

        d3.select(elemRef.current).selectAll("svg").remove()
        const svg = d3.select(elemRef.current).append("svg").attr("width", "100%").attr("height", height).append("g")

        svg.append("g")
            .attr("transform", "translate(" + (width - xmargin * 2) + "," + ymargin + ")")
            .classed("y axis", true)
            .call(yAxis)

        svg.append("g")
            .attr("transform", "translate(0," + (height - ymargin) + ")")
            .classed("x axis", true)

        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width - xmargin * 2)
            .attr("height", height - ymargin * 2)
            .attr("transform", "translate(-1.5, 20)")

        svg.append("g")
            .attr("clip-path", "url(#clip)")
            .classed("line_", true)
            .append("path")
            .datum(telemetry)
            .classed("line", true)
            .style("fill", "none")
            .style("stroke", "steelblue")
            .style("stroke-width", "1.5px")
    }, [width])

    useLayoutEffect(
        () => {
            const { xScale, yScale } = scaleRef.current
            const { xAxis } = axisRef.current

            // const snap = new Date().getTime()
            // const diff = Math.min(snap - now.current, 2000)
            // console.log("DIFF", diff)
            // now.current = snap

            const line = d3
                .line()
                .x(function (d) {
                    return xScale(d["t"])
                })
                .y(function (d) {
                    return yScale(d["x"])
                })

            const lineselection = d3.select(elemRef.current).selectAll(".line_").select("path").datum(telemetry)

            const t2 = telemetry[telemetry.length - 1]?.t

            const shift = (width - xmargin * 2) / 20 // xScale.range()[1] / (duration / 50 - 2)
            // console.log("RANGE", xScale.range(), "SHIFT", shift)
            lineselection
                .interrupt()
                .transition()
                .duration(duration * 2)
                .ease(d3.easeLinear)
                .attr("transform", "translate(" + -shift + "," + ymargin + ")")
            // .attr("transform", "translate(" + -156 + "," + margin + ")")

            // if (telemetry[0].t < time - time_frame - duration) {
            //     console.log("shift")
            //     data.shift()
            // }

            lineselection.attr("d", line).attr("transform", "translate(0," + ymargin + ")")

            // start_time = time - duration * 2 - time_frame

            // xScale.domain([0, 500]).range([width - margin * 2, 0])
            xScale.domain([t2 - duration, t2]).range([0, width - xmargin * 2])

            const selection = d3.select(elemRef.current).select("g").selectAll(".x.axis")
            selection
                .transition()
                .duration(duration * 2)
                .ease(d3.easeLinear)
                .call(xAxis)
                .remove()
        },
        [
            /*telemetry, width*/
        ]
    )

    return <div ref={elemRef} {...props} />
})`
    width: 100%;
`
