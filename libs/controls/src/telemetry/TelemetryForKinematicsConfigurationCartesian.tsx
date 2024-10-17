/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { axis_colors } from "./update"
import {
    CaptureState,
    TelemetryEntry,
    TelemetryPVAT,
    useKinematicsConfiguration,
    useMachineConfig,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import {
    StyledAxisToggle,
    StyledChartsContainer,
    StyledTelemetryForKinematicsConfiguration
} from "./styles"
import { TelemetryChartPrimary } from "./TelemetryChartPrimary"
import { TelemetryChartBrush } from "./TelemetryChartBrush"
import { TelemetrySeries } from "./types"
import { useScale } from "../util"

const axes = ["x", "y", "z"]

type TelemetryForKinematicsConfigurationProps = {
    title: string
    kinematicsConfigurationIndex: number
    visible: boolean
}
export const TelemetryForKinematicsConfigurationCartesian = ({
    title,
    kinematicsConfigurationIndex,
    visible
}: TelemetryForKinematicsConfigurationProps) => {
    const { busCycleTime } = useMachineConfig()
    const { captureState, plot } = useTelemetryControls()
    const config = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const [selected, setSelected] = useState(axes.map(() => true))
    const [brush, setBrush] = React.useState(null)
    const { count } = useTelemetryData()
    const { extent } = useScale()

    useEffect(() => {
        // when switching capture state, make sure there is no brush
        setBrush(null)
    }, [captureState])

    // we determine the domain from the configuration and the plot type
    const domain = useMemo(() => {
        const scale = (1 / (busCycleTime || 1)) * 1000
        switch (plot) {
            case TelemetryPVAT.VEL:
                return [-config.linearLimits[0].vmax / scale, config.linearLimits[0].vmax / scale]
            case TelemetryPVAT.ACC:
                return [
                    -config.linearLimits[0].amax / scale / scale,
                    config.linearLimits[0].amax / scale / scale
                ]
            case TelemetryPVAT.POS:
            default:
                return [-extent, extent]
        }
    }, [extent, plot, config])

    const series: TelemetrySeries[] = useMemo(
        () =>
            axes
                .map((name, axis_index) => {
                    return {
                        key: name,
                        colourIndex: axis_index,
                        secondary: false,
                        value(
                            _entry: TelemetryEntry,
                            arrIndex: number,
                            arr: TelemetryEntry[]
                        ): number {
                            const values: number[] = [-2, -1, 0].map(
                                i =>
                                    arr[arrIndex + i]?.p[kinematicsConfigurationIndex]?.[axis_index]
                            )
                            const values_dot = [values[1] - values[0], values[2] - values[1]]
                            const values_ddot = values_dot[1] - values_dot[0]

                            switch (plot) {
                                case TelemetryPVAT.POS:
                                    return values[2] // last entry
                                case TelemetryPVAT.VEL:
                                    return values_dot[1] || 0
                                case TelemetryPVAT.ACC:
                                    return values_ddot || 0
                                default:
                                    return 0
                            }
                        }
                    }
                })
                .filter((_, index) => selected[index]),
        [axes, kinematicsConfigurationIndex, plot, selected]
    )

    function toggle_selected(index: number) {
        setSelected(selected.map((v, i) => (i === index ? !v : v)))
    }

    const update_brush = useCallback(
        (v: { selection: number[] }) => {
            setBrush(v.selection)
        },
        [setBrush]
    )

    const show_brush = captureState === CaptureState.PAUSED && count > 0

    return (
        <StyledTelemetryForKinematicsConfiguration>
            <div className="controls">
                <div>
                    {axes.map((name, index) => (
                        <StyledAxisToggle
                            key={index}
                            axiscolor={axis_colors[index]}
                            selected={selected[index]}
                            onClick={() => toggle_selected(index)}
                        >
                            <span>{name.toUpperCase()}</span>
                        </StyledAxisToggle>
                    ))}
                </div>
                <div className="title">{title}</div>
            </div>
            {visible && (
                <StyledChartsContainer>
                    <TelemetryChartPrimary series={series} brush={brush} domain={domain} />
                    {show_brush && (
                        <TelemetryChartBrush
                            series={series}
                            onBrush={update_brush}
                            domain={domain}
                        />
                    )}
                </StyledChartsContainer>
            )}
        </StyledTelemetryForKinematicsConfiguration>
    )
}
