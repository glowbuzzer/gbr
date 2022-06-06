import { extend, useThree } from "@react-three/fiber"
import * as React from "react"
import { useEffect } from "react"
import { OrbitControls } from "three-stdlib"

extend({ OrbitControls })

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
