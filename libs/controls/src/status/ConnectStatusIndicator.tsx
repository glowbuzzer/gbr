/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"

const size = 16

type ConnectStatusIndicatorProps = {
    color: "red" | "green" | "orange"
}

/**
 * Simple component to display a green or red circle to indicate connection status.
 * @param connected Whether the connection is active or not.
 */
export const ConnectStatusIndicator = ({ color }: ConnectStatusIndicatorProps) => {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64">
            <filter id="connected-indicator-filter" filterUnits="objectBoundingBox">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feSpecularLighting
                    in="blur"
                    surfaceScale="2"
                    specularConstant="1"
                    specularExponent="10"
                    result="lightingOut"
                    lightingColor="#999999"
                >
                    <feDistantLight azimuth="225" elevation="0" />
                </feSpecularLighting>
                <feComposite in="lightingOut" in2="SourceAlpha" operator="in" result="composite1" />
                <feComposite
                    in="SourceGraphic"
                    in2="composite1"
                    operator="arithmetic"
                    k1="0"
                    k2="1"
                    k3="1"
                />
            </filter>

            <circle cx={32} cy={32} r={30} filter="url(#connected-indicator-filter)" fill={color} />
        </svg>
    )
}
