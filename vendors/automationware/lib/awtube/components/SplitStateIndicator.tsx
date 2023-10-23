/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { StyledStateIndicator } from "./styles"

type SplitStateItem = {
    label: string
    value: boolean
}

type SplitStateIndicatorProps = {
    positive?: boolean
    fallingEdge?: boolean
    items: [SplitStateItem, SplitStateItem]
}

export const SplitStateIndicator = ({ items, positive, fallingEdge }: SplitStateIndicatorProps) => {
    function classes(input: boolean) {
        return [(input ? !fallingEdge : fallingEdge) && "active"].filter(Boolean).join(" ")
    }

    return (
        <StyledStateIndicator>
            <div className={classes(items[0].value)}>{items[0].label}</div>
            <div className={classes(items[1].value)}>{items[1].label}</div>
        </StyledStateIndicator>
    )
}
