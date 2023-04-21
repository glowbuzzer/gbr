/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useKinematicsCartesianPosition, useTrace } from "@glowbuzzer/store"
import { useEffect, useState } from "react"
import { Html } from "@react-three/drei"

export const TraceLabel = ({ kinematicsConfigurationIndex }) => {
    const [tick, setTick] = useState(0)

    const { enabled } = useTrace(kinematicsConfigurationIndex)

    useEffect(() => {
        if (enabled) {
            setTick(0)
            const timer = setInterval(() => setTick(t => t + 1), 100)
            return () => clearInterval(timer)
        }
    }, [enabled])

    if (!enabled) {
        return null
    }

    return <Html>{tick / 10}</Html>
}
