/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { usePrefs } from "@glowbuzzer/store"
import * as React from "react"

type FlowValuesDisplayProps = { values: number[]; labels: string[]; type: "linear" | "angular" }
export const FlowValuesDisplay = ({ values, labels, type }: FlowValuesDisplayProps) => {
    const { getUnits, fromSI } = usePrefs()

    const { units, precision } = getUnits(type)

    return (
        <>
            {values.map(
                (value, index) =>
                    value !== undefined &&
                    value !== null && (
                        <div key={index}>
                            {labels[index]} {fromSI(value, type).toFixed(precision)}
                        </div>
                    )
            )}
            <div>{units}</div>
        </>
    )
}
