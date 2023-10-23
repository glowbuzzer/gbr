/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { StyledStateIndicator } from "./styles"

type StateIndicatorProps = {
    label: React.ReactNode
    value: boolean
    negative?: boolean
    hideWhenInactive?: boolean
}
export const StateIndicator = ({
    label,
    value,
    negative,
    hideWhenInactive
}: StateIndicatorProps) => {
    if (hideWhenInactive && !value) {
        return null
    }
    return (
        <StyledStateIndicator negative={negative}>
            <div className={value ? "active" : ""}>{label}</div>
        </StyledStateIndicator>
    )
}
