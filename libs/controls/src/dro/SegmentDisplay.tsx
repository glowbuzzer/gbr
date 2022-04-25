import React from "react"

import styled from "styled-components"

type SegmentDisplayProps = {
    value: number
    toFixed?: number
    width?: number
    error?: boolean
}

// noinspection CssNoGenericFontName
const StyledSegmentDisplay = styled.span<{ error }>`
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
        color: ${props => (props.error ? "red" : "inherit")};
    }
`

export const SegmentDisplay = ({ value, toFixed, width, error }: SegmentDisplayProps) => {
    let text = toFixed ? value.toFixed(toFixed) : value.toString()
    if (width) {
        const length = width - text.length
        text =
            Array.from({ length })
                .map(() => "!")
                .join("") + text
    }
    const padding = text
        .split("")
        .map(c => (c === "." ? "." : c === "+" ? "+" : "8"))
        .join("")

    return (
        <StyledSegmentDisplay error={error}>
            <span className="background">{padding}</span>
            <span className="foreground">{text}</span>
        </StyledSegmentDisplay>
    )
}
