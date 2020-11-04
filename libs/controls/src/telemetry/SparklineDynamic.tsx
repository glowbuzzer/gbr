import * as React from "react"
import * as d3 from "d3"
import { Axis, AxisDomain, Line, ScaleLinear } from "d3"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
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
export const SparklineDynamic = ({ data, duration, layout }: SparklineDynamicProps) => {
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

        // let y = 0
        // for (const group of layout) {
        //     const { items, height, title } = group
        //     for (const [index, item] of Object.entries(items)) {
        //         const yScale = d3
        //             .scaleLinear()
        //             .domain(item.domain)
        //             .range([y, y + g.height])
        //     }
        //     for (let n = 0; n < g.count; n++) {
        //         if (!this.groups[index]) {
        //             this.groups[index] = []
        //         }
        //         this.groups[index][n] = {
        //             path: chart.append("path").attr("class", "sparkline sparkline-" + g.styles[n]),
        //             line: d3
        //                 .line<DataPoint>()
        //                 .x((d: DataPoint) => this.xScale!(d.t))
        //                 .y((d: DataPoint) => yScale(d.values[index][n]))
        //         }
        //     }
        //     offset += g.height
        // }

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

export class SparklineDynamicx extends React.Component<any, any> {
    private node: HTMLDivElement | undefined
    private groups: { path: any; line: Line<DataPoint> }[][] = []
    private axisX: any
    private xAxis: Axis<number | { valueOf(): number }> | undefined
    private xScale: ScaleLinear<number, number> | undefined

    constructor(props: SparklineDynamicProps) {
        super(props)
        this.assignRefNode = this.assignRefNode.bind(this)
    }

    componentDidMount(): void {
        const chart = d3.select(this.node!).append("svg")

        // const {chart} = this;
        const { width, height } = this.props

        chart.attr("width", width).attr("height", height)

        const { duration } = this.props

        this.xScale = d3.scaleLinear().domain([-duration, 0]).range([0, width])

        let offset = 0
        this.props.placement.forEach((g, index) => {
            const yScale = d3
                .scaleLinear()
                .domain(g.domain)
                .range([g.height + offset, offset])
            for (let n = 0; n < g.count; n++) {
                if (!this.groups[index]) {
                    this.groups[index] = []
                }
                this.groups[index][n] = {
                    path: chart.append("path").attr("class", "sparkline sparkline-" + g.styles[n]),
                    line: d3
                        .line<DataPoint>()
                        .x((d: DataPoint) => this.xScale!(d.t))
                        .y((d: DataPoint) => yScale(d.values[index][n]))
                }
            }
            offset += g.height
        })

        this.xAxis = d3.axisBottom(this.xScale) // .scale(x);
        this.axisX = chart
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - 20) + ")")
            .call(this.xAxis)
    }

    assignRefNode(ref: any) {
        this.node = ref!
    }

    componentWillUpdate(newProps: any): void {
        const { data, duration } = newProps

        if (!data.length) {
            return
        }

        const globalX = data[data.length - 1].t

        this.xScale!.domain([globalX - duration, globalX])
        this.axisX.call(this.xAxis)

        this.groups.forEach(group => {
            for (let n = 0; n < group.length; n++) {
                group[n].path.datum(data).attr("d", group[n].line)
            }
        })
    }

    render() {
        return <div ref={this.assignRefNode} />
    }
}
