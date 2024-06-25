import { createContext, useContext } from "react"
import { slave } from "../slavecatTypes/Slave"

// Create the context
export const SlaveCatContext = createContext(<slave[]>[])

// Export the context and a custom hook to use it
export const useSlaveCat = () => useContext(SlaveCatContext)
