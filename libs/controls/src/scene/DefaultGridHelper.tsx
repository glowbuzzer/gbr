/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Euler, Vector3 } from "three"
import { TriadHelper } from "./TriadHelper"
import * as React from "react"
import { useScale } from "./ScaleProvider"

export const DefaultGridHelper = () => {
    const { extent } = useScale()

    return (
        <>
            <gridHelper
                args={[2 * extent, 20, undefined, 0xd0d0d0]}
                rotation={new Euler(Math.PI / 2)}
            />

            <group position={new Vector3((-extent * 11) / 10, -extent / 5, 0)}>
                <TriadHelper size={extent / 4} />
            </group>
        </>
    )
}
