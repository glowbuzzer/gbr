/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaseReducer, PayloadAction, Slice } from "@reduxjs/toolkit"
import { GlowbuzzerStatus, RootState } from "@glowbuzzer/store"
import { useRef } from "react"
import { useSelector } from "react-redux"

/** Convenience type for a reducer that takes status as payload and passes it into the redux store (perhaps with some processing) */
export type StatusUpdateReducer<T> = { status: CaseReducer<T, PayloadAction<T>> }

/** Convenience type for a slice which only has a single reducer which passes state from payload into the store */
export type StatusUpdateSlice<T> = Slice<T, StatusUpdateReducer<T>>

/**
 * A selector that only updates when the heartbeat changes.
 * @param selector
 */
// export function useHeartbeatBasedSelector<T>(selector: (state: RootState) => T): T {
//     const { value } = useSelector<RootState, { heartbeat: number; value: T }>(
//         state => ({
//             heartbeat: state.machine.heartbeat,
//             value: selector(state)
//         }),
//         (a, b) => a.heartbeat === b.heartbeat
//     )
//     return value
// }
