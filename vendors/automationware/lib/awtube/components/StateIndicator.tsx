/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { StyledStateIndicator } from "./styles"

type StateIndicatorProps = {
    label: React.ReactNode
    value: boolean
    negative?: boolean
    inverted?: boolean
    hideWhenInactive?: boolean
}
export const StateIndicator = ({
    label,
    value: _value,
    negative,
    inverted,
    hideWhenInactive
}: StateIndicatorProps) => {
    const value = inverted ? !_value : _value

    if (hideWhenInactive && !value) {
        return null
    }
    return (
        <StyledStateIndicator negative={negative}>
            <div className={value ? "active" : ""}>{label}</div>
        </StyledStateIndicator>
    )
}
