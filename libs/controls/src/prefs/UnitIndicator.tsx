import * as React from "react"
import { usePrefs } from "@glowbuzzer/store"

export const UnitIndicator = ({ type }: { type: "scalar" | "angular" }) => {
    const prefs = usePrefs()

    const defaults = {
        scalar: "mm",
        angular: "rad"
    }
    return <span>{prefs.current["units_" + type] || defaults[type]}</span>
}
