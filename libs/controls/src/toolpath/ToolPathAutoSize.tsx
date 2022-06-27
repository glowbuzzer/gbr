/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { extend, useThree } from "@react-three/fiber"
import * as React from "react"
import { useEffect } from "react"
import { OrbitControls } from "three-stdlib"

extend({ OrbitControls })

/** @ignore - internal to the tool path tile */
export const ToolPathAutoSize = ({ extent, children }) => {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    useEffect(() => {
        camera.position.z = 2 * extent
    }, [extent])

    return (
        <>
            {/* @ts-ignore */}
            <orbitControls args={[camera, domElement]} />
            {children}
        </>
    )
}
