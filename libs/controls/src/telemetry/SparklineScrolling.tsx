import * as React from "react"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import styled from "styled-components"

type Datapoint = {
    t: number
    values: number[]
}

type SparklineScrollingSeriesOptions = {
    color: string
}

type SparklineScrollingProps = {
    data: Datapoint[]
    domain: number[]
    options: SparklineScrollingSeriesOptions[]
}

type SparklineScrollingLineInfo = {
    line: d3.Line<Datapoint>
    selection: d3.Selection<d3.BaseType, unknown, HTMLDivElement, unknown>
}

export const SparklineScrolling = styled(({ options, data, domain }: SparklineScrollingProps) => {
    const height = 200
    const xmargin = 20
    const ymargin = 20
    const duration = 500
    const scaleRef = useRef(null)
    const axisRef = useRef(null)
    const elemRef = useRef<HTMLDivElement>(null)
    const linesRef = useRef<SparklineScrollingLineInfo[]>(null)

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

    useEffect(() => {
        const xScale = d3
            .scaleLinear()
            .domain([0, 500])
            .range([0, width - xmargin * 2])

        const yScale = d3
            .scaleLinear()
            .domain(domain)
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

        options.forEach((o, index) =>
            svg
                .append("g")
                .attr("clip-path", "url(#clip)")
                .classed("line_" + index, true)
                .append("path")
                .datum([])
                .classed("line", true)
                .style("fill", "none")
                .style("stroke", o.color)
                .style("stroke-width", "1.5px")
        )

        linesRef.current = options.map((_, index) => ({
            line: d3
                .line<Datapoint>()
                .x(function (d) {
                    return xScale(d.t)
                })
                .y(function (d) {
                    return yScale(d.values[index])
                }),
            selection: d3
                .select(elemRef.current)
                .selectAll(".line_" + index)
                .select("path")
        }))
    }, [width, options])

    useEffect(() => {
        const { xScale } = scaleRef.current
        const { xAxis } = axisRef.current

        const t2 = data[data.length - 1]?.t

        // const shift = (width - xmargin * 2) / 20 // xScale.range()[1] / (duration / 50 - 2)
        // console.log("RANGE", xScale.range(), "SHIFT", shift)

        linesRef.current.forEach(({ line, selection }) => {
            selection
                // TODO: figure out how to make it scroll smoothly!
                // .interrupt()
                // .transition()
                // .duration(duration * 2)
                // .ease(d3.easeLinear)
                .attr("d", line)
                .attr("transform", "translate(0," + ymargin + ")")

            selection.datum(data)
        })

        xScale.domain([t2 - duration, t2]).range([0, width - xmargin * 2])

        const selection = d3.select(elemRef.current).select("g").selectAll(".x.axis")
        selection
            // .transition()
            // .duration(duration * 2)
            // .ease(d3.easeLinear)
            .call(xAxis)
        // .remove()
    }, [data, width])

    return <div ref={elemRef} />
})`
    width: 100%;
`
