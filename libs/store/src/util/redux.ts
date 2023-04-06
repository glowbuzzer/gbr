/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaseReducer, PayloadAction, Slice } from "@reduxjs/toolkit"

/** Convenience type for a reducer that takes status as payload and passes it into the redux store (perhaps with some processing) */
export type StatusUpdateReducer<T> = { status: CaseReducer<T, PayloadAction<T>> }

/** Convenience type for a slice which only has a single reducer which passes state from payload into the store */
export type StatusUpdateSlice<T> = Slice<T, StatusUpdateReducer<T>>
