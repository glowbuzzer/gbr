import * as React from "react"
import {
    createContext,
} from "react"

type ActiveExampleContextType = {
    activeExample: number | null
    setActiveExample: React.Dispatch<React.SetStateAction<number | null>>
}

export const ActiveExampleContext = createContext<ActiveExampleContextType>({
    activeExample: 0,
    setActiveExample: () => {
    },
} )

