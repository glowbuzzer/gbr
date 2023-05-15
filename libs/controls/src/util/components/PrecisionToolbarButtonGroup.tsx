/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { DockToolbarButtonGroup } from "../../dock/DockToolbar"
import { ReactComponent as DecreaseDecimalPlaces } from "../icons/decrease-decimal-places.svg"
import { ReactComponent as IncreaseDecimalPlaces } from "../icons/increase-decimal-places.svg"
import { GlowbuzzerIcon } from "../GlowbuzzerIcon"

/** @ignore */
export const PrecisionToolbarButtonGroup = ({ value, onChange }) => {
    function decrease() {
        onChange(Math.max(0, value - 1))
    }

    function increase() {
        onChange(Math.min(10, value + 1))
    }

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon
                useFill={false}
                Icon={DecreaseDecimalPlaces}
                title="Decrease Decimal Places"
                button
                onClick={decrease}
            />
            <GlowbuzzerIcon
                useFill={false}
                Icon={IncreaseDecimalPlaces}
                title="Increase Decimal Places"
                button
                onClick={increase}
            />
        </DockToolbarButtonGroup>
    )
}
