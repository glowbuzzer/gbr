import * as React from "react"
import styled from "styled-components"

const StyledSvg = styled.svg.attrs<{ width: number; color: string }>(props => ({ ...props, width: props.width || 32 }))`
    circle {
        fill: ${props => props.color};
    }
`

export const TrafficLight = ({ ...props }) => (
    <StyledSvg {...props} viewBox="0 0 64 64">
        <filter id="counter" filterUnits="objectBoundingBox">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.3" specularExponent="10" result="lightingOut">
                <fePointLight x="-2000" y="-2000" z="500" />
            </feSpecularLighting>
            <feComposite in="lightingOut" in2="SourceAlpha" operator="in" result="composite1" />
            <feComposite in="SourceGraphic" in2="composite1" operator="arithmetic" k1="0" k2="1" k3="1" />
        </filter>

        <circle cx={32} cy={32} r={32} filter="url(#counter)" />
    </StyledSvg>
)
