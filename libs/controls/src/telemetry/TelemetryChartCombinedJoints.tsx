/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    CaptureState,
    get_telemetry_values_joints,
    KinematicsConfigurationConfig,
    TelemetryVisibilityOptions,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import { TelemetryChartBrush } from "./TelemetryChartBrush"
import { TelemetryChartPrimary } from "./TelemetryChartPrimary"
import { TelemetrySeries } from "./types"
import { StyledChartsContainer } from "./styles"

type TelemetryChartCombinedProps = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    view: TelemetryVisibilityOptions
    selected: boolean[]
}
/**
 * Render the primary chart and the brushable chart below it when the telemetry is paused
 */
export const TelemetryChartCombinedJoints = ({
    kinematicsConfiguration,
    view, // what to view: pos, vel, acc, etc
    selected // the joints selected for charting, using kc indexes
}: TelemetryChartCombinedProps) => {
    const { captureState, plot } = useTelemetryControls()
    const { count, lastTimecode, domains } = useTelemetryData()
    const [brush, setBrush] = React.useState(null)
    const [domain, setDomain] = useState([0, 0])

    useEffect(() => {
        // when the data or selections change, we need to update the y-domain for the chart
        const domain = kinematicsConfiguration.participatingJoints
            .filter((_, i) => selected[i]) // remove unselected joints
            .map(j => domains(j, plot, view)) // get the domains for each joint based on what is being viewed
            .reduce(
                (a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])],
                [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
            ) // get single min/max
        const [from, to] = domain.sort((a, b) => a - b)
        const interval = to - from
        setDomain([from - interval * 0.05, to + interval * 0.05]) // expand by 5%
    }, [lastTimecode, selected, view, plot])

    useEffect(() => {
        // when switching capture state, make sure there is no brush
        setBrush(null)
    }, [captureState])

    const series: TelemetrySeries[] = useMemo(() => {
        return kinematicsConfiguration.participatingJoints
            .map((_, i): TelemetrySeries[] => {
                switch (view) {
                    case TelemetryVisibilityOptions.BOTH:
                        return [
                            {
                                key: `set-${i}`,
                                colourIndex: i,
                                value: item => get_telemetry_values_joints(item, i, view, plot)[0]
                            },
                            {
                                key: `act-${i}`,
                                colourIndex: i,
                                value: item => get_telemetry_values_joints(item, i, view, plot)[1],
                                secondary: true
                            }
                        ]
                    case TelemetryVisibilityOptions.ACT:
                        return [
                            {
                                key: `act-${i}`,
                                colourIndex: i,
                                value: item => get_telemetry_values_joints(item, i, view, plot)[0],
                                secondary: true
                            }
                        ]
                    default:
                        return [
                            {
                                key: `set-${i}`,
                                colourIndex: i,
                                value: item => get_telemetry_values_joints(item, i, view, plot)[0]
                            }
                        ]
                }
            })
            .filter((_, i) => selected[i])
            .flat()
    }, [kinematicsConfiguration.participatingJoints, view, plot, selected])

    // we want a stable function as we pass this as prop to the brush component
    const update_brush = useCallback(
        (v: { selection: number[] }) => {
            setBrush(v.selection)
        },
        [setBrush]
    )

    // do we want to show the brushable area?
    const show_brush = captureState === CaptureState.PAUSED && count > 0

    return (
        <StyledChartsContainer>
            <TelemetryChartPrimary series={series} brush={brush} domain={domain} />
            {show_brush && (
                <TelemetryChartBrush series={series} onBrush={update_brush} domain={domain} />
            )}
        </StyledChartsContainer>
    )
}
