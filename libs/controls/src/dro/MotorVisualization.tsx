/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useRef } from "react"
import { radToDeg } from "three/src/math/MathUtils"

type MotorVisualizationProps = {
    /**
     * Width of motor in pixels. Height will be scaled to maintain aspect ratio
     */
    width: number
    /**
     * Position of the pointer in degrees
     */
    value: number
}

/**
 * Displays a simple visualisation of a motor with position indicator.
 */
export const MotorVisualization = ({ width, value }: MotorVisualizationProps) => {
    const spinner = useRef<SVGSVGElement>(null)

    useEffect(() => {
        spinner.current?.setAttribute("transform", `rotate(${radToDeg(value)})`)
    }, [value])

    return (
        <svg width={width} version="1.1" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="filter1538" colorInterpolationFilters="sRGB">
                    <feTurbulence baseFrequency="0.002" numOctaves="1" result="result0" seed="7" />
                    <feColorMatrix result="result4" type="saturate" values="0" />
                    <feComposite
                        in="SourceGraphic"
                        in2="result4"
                        k1="0.75"
                        k2="0.5"
                        k3="0.5"
                        operator="arithmetic"
                        result="result2"
                    />
                    <feBlend in="result2" in2="SourceGraphic" result="result5" />
                    <feComposite in="result5" in2="SourceGraphic" operator="in" result="result3" />
                </filter>
            </defs>
            <rect
                x="10"
                y="10"
                width="180"
                height="180"
                rx="20"
                ry="20"
                fill="#ffffff"
                filter="url(#filter1538)"
                stroke="#999"
            />
            <circle cx="100" cy="100" r="70" fill="#444" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#c0c0c0" strokeWidth="2" />
            <circle cx="100" cy="100" r="44" fill="none" stroke="#000" strokeWidth="2" />
            <g fill="#666">
                <circle cx="30" cy="30" r="6" />
                <circle cx="170" cy="30" r="6" />
                <circle cx="170" cy="170" r="6" />
                <circle cx="30" cy="170" r="6" />
            </g>
            <g transform="translate(100,100)">
                <g ref={spinner}>
                    <path
                        d="m0 10h75"
                        fill="none"
                        stroke="#D39900"
                        strokeLinecap="round"
                        strokeWidth="8"
                    />
                    <circle cx="0" cy="0" r="14" fill="#D39900" />
                </g>
            </g>
            <circle cx="100" cy="100" r="8" fill="#f0f0f0" filter="url(#filter1538)" />
            <circle cx="100" cy="100" r="7" fill="none" stroke="#a0a0a0" strokeWidth="2" />
        </svg>
    )
}
