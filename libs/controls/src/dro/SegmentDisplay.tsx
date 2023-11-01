/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"

import styled from "styled-components"

type SegmentDisplayProps = {
    /** Value to display */
    value: number
    /** Fixed number of decimal places */
    toFixed?: number
    /** Number of digits to display. Values will be padded with leading zeros up to this width */
    width?: number
    /** Whether the value is in error (for example, beyond configured extents). Causes the value to be displayed in red */
    error?: boolean
}

// noinspection CssNoGenericFontName
const StyledSegmentDisplay = styled.span<{ $error }>`
    font-family: DSEG7-Classic;
    font-size: 20px;
    //text-align: center;

    position: relative;

    .background {
        position: absolute;
        user-select: none;
        color: rgba(128, 128, 128, 0.2);
        z-index: -100;
    }

    .foreground {
        z-index: 1000;
        color: ${props => (props.$error ? "red" : "inherit")};
    }
`

/**
 * Displays a given numeric value as a traditional segmented display.
 */
export const SegmentDisplay = ({ value, toFixed, width, error }: SegmentDisplayProps) => {
    let text = toFixed === undefined ? value.toString() : value.toFixed(toFixed)
    // if (width) {
    //     const length = width - text.length
    //     text =
    //         Array.from({ length })
    //             .map(() => "!")
    //             .join("") + text
    // }
    const padding = text
        .split("")
        .map(c => (c === "." ? "." : c === "+" ? "+" : "8"))
        .join("")

    return (
        <StyledSegmentDisplay $error={error}>
            <span className="background">{padding}</span>
            <span className="foreground">{text}</span>
        </StyledSegmentDisplay>
    )
}
