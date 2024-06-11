import { createContext, useContext } from "react"
import { Slave } from "../slavecatTypes/Slave"

// Create the context
export const SlaveCatContext = createContext(<Slave[]>[])

// Export the context and a custom hook to use it
export const useSlaveCat = () => useContext(SlaveCatContext)
