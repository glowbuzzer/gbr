import * as React from "react"
import styled from "styled-components"

const StyledSvg = styled.svg`
    width: 100%;
    height: 30px;
    display: block;
    .rect {
        stroke: none;
        fill: ${props => props.theme.colorTextTertiary};
        opacity: 0.5;
    }
    .bar {
        fill: ${props => props.theme.colorTextTertiary};
        stroke: none;
    }
    stroke: ${props => props.theme.colorText};
`

export const PosSlider = ({ min, max, current }) => {
    const range = max - min
    const percentage = ((current - min) / range) * 100 || 0
    const zero_point = Math.abs(min) / range
    const zero_point_percent = zero_point * 100

    return (
        <StyledSvg viewBox="0 0 100 30" preserveAspectRatio="none">
            <rect
                className="rect"
                x="0"
                y="0"
                width="100"
                height="30"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            <line
                x1={zero_point_percent}
                y1="0"
                x2={zero_point_percent}
                y2="30"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
            <rect
                className="bar"
                x={Math.min(zero_point_percent, percentage)}
                y="5"
                width={Math.abs(zero_point_percent - percentage)}
                height="20"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
            />
        </StyledSvg>
    )
}
