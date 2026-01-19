/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { MachineStatus } from "../gbc"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../root"
import { useMachineConfig } from "../machine"
import { useMemo } from "react"

type MonitorStats = {
    min: number
    max: number
    count: number
    sum: number
    sumSquared: number
    last: number
}

type MonitorSliceState = {
    count: number
    heartbeat: MonitorStats
    status: MonitorStats
}

type MonitorSliceReducers = {
    status(state: MonitorSliceState, action: PayloadAction<MachineStatus>): void
    reset(): MonitorSliceState
}

const INITIAL_STATE: MonitorSliceState = {
    count: 0,
    heartbeat: {
        count: 0,
        max: null,
        min: null,
        sum: 0,
        sumSquared: 0,
        last: 0
    },
    status: {
        count: 0,
        max: null,
        min: null,
        sum: 0,
        sumSquared: 0,
        last: 0
    }
}

function update_stats(stats: MonitorStats, current: number) {
    const value = current - stats.last
    if (stats.min === null || value < stats.min) {
        stats.min = value
    }
    if (stats.max === null || value > stats.max) {
        stats.max = value
    }
    stats.count++
    stats.sum += value
    stats.sumSquared += value * value
    stats.last = current
}

function calc(stats: MonitorStats, factor = 1) {
    const sum = stats.sum * factor
    const mean = sum / stats.count || 0
    const sumSquared = stats.sumSquared * (factor * factor)

    return {
        ...stats,
        mean,
        min: stats.min * factor,
        max: stats.max * factor,
        std:
            Math.sqrt(
                (sumSquared - 2 * mean * sum + stats.count * mean * mean) / (stats.count - 1)
            ) || 0
    }
}

export const monitorSlice: Slice<MonitorSliceState, MonitorSliceReducers> = createSlice({
    name: "monitor",
    initialState: INITIAL_STATE,
    reducers: {
        status(state: MonitorSliceState, { payload }: PayloadAction<MachineStatus>) {
            const now = Date.now()
            state.count++
            if (state.count < 10) {
                // don't do any calcs for first 10 cycles
                state.status.last = now
                state.heartbeat.last = payload.heartbeat
                return
            }
            update_stats(state.heartbeat, payload.heartbeat)
            update_stats(state.status, now)
        },
        reset() {
            return INITIAL_STATE
        }
    }
})

/** @ignore */
export function useConnectionMonitorStats() {
    const { busCycleTime } = useMachineConfig()

    const heartbeat = useSelector(
        (state: RootState) => state.monitor.heartbeat,
        (a, b) => a.count % 10 === b.count % 10
    )
    const status = useSelector(
        (state: RootState) => state.monitor.status,
        (a, b) => a.count % 10 === b.count % 10
    )

    return useMemo(
        () => ({
            heartbeat: calc(heartbeat, busCycleTime),
            status: calc(status)
        }),
        [heartbeat, status, busCycleTime]
    )
}

/** @ignore */
export function useConnectionMonitorReset() {
    const dispatch = useDispatch()

    return () => dispatch(monitorSlice.actions.reset())
}
