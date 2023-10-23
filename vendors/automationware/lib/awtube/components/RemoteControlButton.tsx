/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useDigitalInputs } from "@glowbuzzer/store"
import { DigitalInputs } from "../types"

export const RemoteControlButton = ({ size }) => {
    const inputs = useDigitalInputs()
    const active = inputs[DigitalInputs.RC_LIGHT]

    return (
        <svg width={size} height={size} viewBox="0 0 64 64">
            <filter id="indicator-inline" filterUnits="objectBoundingBox">
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

            <circle
                cx={32}
                cy={32}
                r={30}
                filter="url(#indicator-inline)"
                fill={`rgba(0,${active ? 120 : 40},0,1)`}
            />
            <rect x="12" y="92" width="40" height="6" fill="none" />
        </svg>
    )
}
