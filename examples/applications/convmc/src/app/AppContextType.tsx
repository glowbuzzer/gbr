/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createContext } from "react"

type AppContextType = {
    running: boolean
    state: string
    previousState?: string
    data?
    setRunning(run: boolean): void
}

export const appContext = createContext<AppContextType>(null)
