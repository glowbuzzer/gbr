/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    CaptureState,
    KinematicsConfigurationConfig,
    TelemetryVisibilityOptions,
    useTelemetryControls,
    useTelemetryData
} from "@glowbuzzer/store"
import styled from "styled-components"
import { TelemetryChartPrimary } from "./TelemetryChartPrimary"
import { TelemetryChartBrush } from "./TelemetryChartBrush"

const StyledDiv = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; // othewise svg will grow indefinitely

    path {
        stroke-width: 1;
        fill: none;
    }

    .main {
        width: 100%;
        flex-grow: 1;
        .x.axis {
            transform: translate(0, calc(100% - 30px));
        }
        .y.axis {
            transform: translate(calc(100% - 30px), 0);
        }
    }

    .brush {
        height: 100px;
        width: calc(100% - 30px);
        //background: rgba(255, 255, 255, 0.05);

        path {
            opacity: 0.5;
            user-select: none;
        }
    }

    rect.selection {
        //fill: none;
        stroke: none;
    }
    rect.handle {
        fill: none;
        stroke: none;
    }
`

type TelemetryChartCombinedProps = {
    kinematicsConfiguration: KinematicsConfigurationConfig
    view: TelemetryVisibilityOptions
    selected: boolean[]
}
/**
 * Render the primary chart and the brushable chart below it when the telemetry is paused
 */
export const TelemetryChartCombined = ({
    kinematicsConfiguration,
    view, // what to view: pos, vel, acc, etc
    selected // the joints selected for charting, using kc indexes
}: TelemetryChartCombinedProps) => {
    const { captureState, plot } = useTelemetryControls()
    const { count, lastTimecode, domains } = useTelemetryData()
    const [brush, setBrush] = React.useState(null)
    const [domain, setDomain] = useState([0, 0])
    const elemRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // when the data or selections change, we need to update the y-domain for the chart
        const domain = kinematicsConfiguration.participatingJoints
            .filter((_, i) => selected[i]) // remove unselected joints
            .map(j => domains(j, plot, view)) // get the domains for each joint based on what is being viewed
            .reduce(
                (a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])],
                [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
            ) // get single min/max
        const [from, to] = domain.sort()
        const interval = Math.abs(to - from)
        setDomain([from - interval * 0.05, to + interval * 0.05]) // expand by 5%
    }, [lastTimecode, selected, view, plot])

    useEffect(() => {
        // when switching capture state, make sure there is no brush
        setBrush(null)
    }, [captureState])

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
        <StyledDiv ref={elemRef}>
            <TelemetryChartPrimary
                joints={kinematicsConfiguration.participatingJoints}
                selected={selected}
                view={view}
                brush={brush}
                domain={domain}
            />
            {show_brush && (
                <TelemetryChartBrush
                    joints={kinematicsConfiguration.participatingJoints}
                    selected={selected}
                    view={view}
                    onBrush={update_brush}
                    domain={domain}
                />
            )}
        </StyledDiv>
    )
}
