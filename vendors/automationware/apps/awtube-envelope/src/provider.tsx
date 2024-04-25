/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Vector3 } from "@glowbuzzer/store"
import { createContext, useContext, useMemo, useState } from "react"

export type PointDef = Vector3 & {
    singularity?: boolean | undefined
}

type EnvelopeProviderContextType = {
    points: PointDef[]
    setPoints: (points: PointDef[]) => void
}

const EnvelopeProviderContext = createContext<EnvelopeProviderContextType>(null)

export const EnvelopeProvider = ({ children }) => {
    const [points, setPoints] = useState<PointDef[]>([])

    const context = useMemo(() => ({ points, setPoints }), [points])

    return (
        <EnvelopeProviderContext.Provider value={context}>
            {children}
        </EnvelopeProviderContext.Provider>
    )
}

export function useEnvelopeProvider() {
    return useContext(EnvelopeProviderContext)
}
