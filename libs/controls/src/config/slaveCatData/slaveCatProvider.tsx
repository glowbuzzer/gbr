import React, { useEffect, useState, ReactNode } from "react"

import { Slave } from "../slavecatTypes/Slave"
import { SlaveCatContext } from "./slaveCatContext"

interface SlaveCatProviderProps {
    children: ReactNode
}

export const SlaveCatProvider = ({ children }: SlaveCatProviderProps) => {
    const [slaveData, setSlaveData] = useState<Slave[]>([])

    useEffect(() => {
        import("../slaveCatData/slaveCatData.json")
            .then(data => setSlaveData(data.default as any))
            .catch(error => console.error("Error importing JSON:", error))
    }, [])

    return <SlaveCatContext.Provider value={slaveData}>{children}</SlaveCatContext.Provider>
}
