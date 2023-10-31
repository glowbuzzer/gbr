/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    KinematicsConfigurationConfig,
    TelemetryPVAT,
    useTelemetryData,
    useTelemetrySettings
} from "@glowbuzzer/store"
import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import * as d3 from "d3"
import { SparklineScrolling } from "./SparklineScrolling"

export const axis_colors = [
    "#a6cee3",
    "#1f78b4",
    "#b2df8a",
    "#33a02c",
    "#fb9a99",
    "#e31a1c",
    "#444444"
]

export enum TelemetryVisibilityOptions {
    SET = 0b01,
    ACT = 0b10,
    BOTH = 0b11,
    DIFF = 0b100
}

type SparklineJointsProps = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    view: TelemetryVisibilityOptions
    selected: boolean[]
    duration: number
}
export const SparklineJoints = ({
    kinematicsConfiguration,
    view,
    selected,
    duration
}: SparklineJointsProps) => {
    const elemRef = useRef<HTMLDivElement>(null)
    const telemetry = useTelemetryData()
    const { plot } = useTelemetrySettings()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setHeight(entry.contentRect.height)
            }
        })

        if (elemRef.current) {
            resizeObserver.observe(elemRef.current)
        }

        return () => {
            if (elemRef.current) {
                resizeObserver.unobserve(elemRef.current)
            }
        }
    }, [])

    const selectedJointOptions = useMemo(() => {
        return kinematicsConfiguration.participatingJoints
            .map((_, i) => axis_colors[i])
            .filter((_, i) => selected[i])
            .map(color => {
                switch (view) {
                    case TelemetryVisibilityOptions.SET:
                        return [{ color, dashArray: "" }]
                    case TelemetryVisibilityOptions.ACT:
                        return [{ color, dashArray: "2,2" }]
                    case TelemetryVisibilityOptions.BOTH:
                        return [
                            { color, dashArray: "" },
                            { color, dashArray: "2,2" }
                        ]
                    case TelemetryVisibilityOptions.DIFF:
                        return [{ color, dashArray: "" }]
                }
            })
            .flat()
    }, [kinematicsConfiguration.participatingJoints, selected, view])

    const { data, domain } = useMemo(() => {
        const data = telemetry.map(d => ({
            t: d.t,
            values: kinematicsConfiguration.participatingJoints
                .map(index => {
                    switch (view) {
                        case TelemetryVisibilityOptions.SET:
                            switch (plot) {
                                case TelemetryPVAT.POS:
                                    return d.set[index].p
                                case TelemetryPVAT.VEL:
                                    return d.set[index].v
                                case TelemetryPVAT.TORQUE:
                                    return d.set[index].t + d.set[index].to
                                default:
                                    return 0
                            }
                        case TelemetryVisibilityOptions.ACT:
                            return [d.act[index][plot]]
                        case TelemetryVisibilityOptions.BOTH:
                            return [d.set[index][plot], d.act[index][plot]]
                        case TelemetryVisibilityOptions.DIFF:
                            return [d.set[index][plot] - d.act[index][plot]]
                    }
                })
                .filter((_, i) => selected[i])
                .flat()
        }))

        const [min, max] = d3.extent(data.flatMap(d => d.values)).sort()
        const extent = Math.abs(max - min)
        const domain = [min - extent * 0.1, max + extent * 0.1]
        return { data, domain }
    }, [telemetry, kinematicsConfiguration, plot, view, selected])

    return (
        <div ref={elemRef} className="chart">
            <SparklineScrolling
                height={height}
                domain={domain}
                options={selectedJointOptions}
                data={data}
                duration={duration}
            />
        </div>
    )
}
