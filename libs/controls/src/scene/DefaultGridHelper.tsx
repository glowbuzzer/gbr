/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Euler, Vector3 } from "three"
import { TriadHelper } from "./TriadHelper"
import * as React from "react"
import { useGlowbuzzerTheme } from "../app"
import { useScale } from "../util"

export const DefaultGridHelper = () => {
    const { extent } = useScale()
    const { darkMode } = useGlowbuzzerTheme()

    const centreColor = darkMode ? 0x666666 : 0x666666
    const gridColor = darkMode ? 0x444444 : 0xcccccc

    return (
        <>
            <gridHelper
                args={[2 * extent, 20, centreColor, gridColor]}
                position={[0, 0, 1]}
                rotation={new Euler(Math.PI / 2)}
            />

            <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                <TriadHelper size={extent / 4} />
            </group>
        </>
    )
}
