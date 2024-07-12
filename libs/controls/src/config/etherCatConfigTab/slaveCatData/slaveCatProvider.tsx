import React, { useEffect, useState, ReactNode } from "react"

import { slave } from "../slavecatTypes/Slave"
import { SlaveCatContext } from "./slaveCatContext"

interface SlaveCatProviderProps {
    children: ReactNode
}

export const SlaveCatProvider = ({ children }: SlaveCatProviderProps) => {
    const [slaveData, setSlaveData] = useState<slave[]>([])

    useEffect(() => {
        import("../slaveCatData/slaveCatData.json")
            // @ts-ignore
            .then(data => setSlaveData(data.default))
            .catch(error => console.error("Error importing JSON:", error))
    }, [])

    return <SlaveCatContext.Provider value={slaveData}>{children}</SlaveCatContext.Provider>
}
