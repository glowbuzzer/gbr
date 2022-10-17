/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { DockToolbarButtonGroup } from "../../dock/DockToolbar"
import { ReactComponent as DecreaseDecimalPlaces } from "../icons/decrease-decimal-places.svg"
import { ReactComponent as IncreaseDecimalPlaces } from "../icons/increase-decimal-places.svg"
import { GlowbuzzerIcon } from "../GlowbuzzerIcon"

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
                Icon={DecreaseDecimalPlaces}
                title="Decrease Decimal Places"
                button
                onClick={decrease}
            />
            <GlowbuzzerIcon
                Icon={IncreaseDecimalPlaces}
                title="Increase Decimal Places"
                button
                onClick={increase}
            />
        </DockToolbarButtonGroup>
    )
}
