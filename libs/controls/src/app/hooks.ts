/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext } from "react"

export const appNameContext = createContext<string>("unknown")

export function useAppName() {
    return React.useContext(appNameContext)
}
