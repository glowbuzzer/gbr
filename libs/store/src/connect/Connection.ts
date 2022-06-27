/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {Action, ThunkAction} from "@reduxjs/toolkit"
import {RootState} from "../root"

/**
 * We put these here to avoid circular dependencies between modules
 */

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export interface Connection {
    connect(url): AppThunk

    send(msg): AppThunk

    disconnect(): AppThunk
}
