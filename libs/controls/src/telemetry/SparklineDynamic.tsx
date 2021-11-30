import * as React from "react"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Axis, AxisDomain, ScaleLinear } from "d3"
import styled from "@emotion/styled"
import { Selection } from "d3-selection"

export type DataPoint = { t: number; values: number[][] }

export type TimeSeriesData = { t: number; data: { [label: string]: number } }[]

type DataItem = {
    name: string
    domain: [number, number]
}

export type SparklineDynamicProps = {
    width: number
    height: number
    data: TimeSeriesData
    duration: number
    layout: { title: string; items: DataItem[]; height: number }[]
}

const SparklineDiv = styled.div`
    width: 100%;
    height: 100%;
    min-height: 400px;
    background: lightgrey;
`
export const SparklineDynamic = ({ data, duration }: SparklineDynamicProps) => {
    const divRef = useRef<HTMLDivElement>(null)
    const axisX = useRef<{
        scale: ScaleLinear<number, number>
        axis: Axis<AxisDomain>
        node: Selection<any, unknown, null, undefined>
    }>({} as any)

    const [chart, setChart] = useState<Selection<any, unknown, null, undefined>>()

    useEffect(() => {
        const node = divRef.current
        const width = divRef.current.clientWidth
        const height = divRef.current.clientHeight

        const chart = d3.select(node).append("svg")
        chart.attr("width", width).attr("height", height)

        setChart(chart)
    }, [])

    useEffect(() => {
        if (!chart) {
            return
        }

        const width = divRef.current.clientWidth
        const height = divRef.current.clientHeight

        const t1 = data[0]?.t || 0
        const t2 = data[data.length - 1]?.t || 0

        const actual_duration = t2 - t1
        const offset = ((duration - actual_duration) / duration) * width

        chart.select("*").remove()
        axisX.current.scale = d3.scaleLinear().domain([t1, t2]).range([offset, width])
        axisX.current.axis = d3.axisBottom(axisX.current.scale).ticks(actual_duration / 50)
        axisX.current.node = chart
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - 20) + ")")
    }, [chart, data, duration])

    useEffect(() => {
        axisX.current?.node?.call(axisX.current.axis)
    }, [data])
    return <SparklineDiv ref={divRef} />
}
