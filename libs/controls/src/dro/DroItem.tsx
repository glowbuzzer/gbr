/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { usePrefs } from "@glowbuzzer/store"
import { SegmentDisplay } from "./SegmentDisplay"
import * as React from "react"

type DroItemProps = {
    /**
     * The label for this DRO item
     */
    label: string
    /**
     * The current value in standard units (millimeters or radians)
     */
    value: number
    /**
     * Whether the value is scalar or angular. This affects automatic unit conversion according to preferences.
     */
    type: "linear" | "angular"

    /**
     * Whether the value is in error (shown in a different colour)
     */
    error?: boolean
}

/**
 * Displays a single DRO item with label and optional error state.
 */
export const DroItem = ({ label, value, type, error }: DroItemProps) => {
    const { getUnits, fromSI } = usePrefs()
    const { units, precision } = getUnits(type)

    return (
        <>
            <div className="label">{label}</div>
            <div className="value">
                <SegmentDisplay
                    value={fromSI(value, type)}
                    toFixed={precision}
                    width={12}
                    error={error}
                />
                {units}
            </div>
        </>
    )
}
