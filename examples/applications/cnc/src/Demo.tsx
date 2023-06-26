/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Mesh, MeshPhysicalMaterial, Vector3 } from "three"
import { OrbitControls } from "@react-three/drei"
import styled from "styled-components"
import { Face3, Geometry } from "three-stdlib"
import { CustomGeometry } from "./CustomGeometry"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { Button, Checkbox } from "antd"
import { current } from "@reduxjs/toolkit"

const STEP = 0.01
const BoxWithCutout = ({ wireframe, animate }) => {
    const angle = useRef(0)

    const geometry = useMemo(() => {
        const customGeometry = new CustomGeometry(10, 10, 1, 200)
        customGeometry.computeVertexNormals()
        // customGeometry.addSegment(new Vector3(0, 0, 0), new Vector3(10, 10, 0), 0.08, 0.2)
        return customGeometry
    }, [])

    useFrame((root, delta) => {
        function point(angle) {
            return new Vector3(
                Math.sin(angle * 13 - angle / 100) * 5,
                Math.cos(angle * 11 + angle / 100) * 5,
                0
            )
        }
        if (animate) {
            const next_angle = angle.current + delta
            while (angle.current < next_angle) {
                const current = point(angle.current)
                const next = point(angle.current + STEP)

                geometry.addSegment(current, next, 0.08, 0.2)
                angle.current += STEP
            }
        }
    })

    return (
        <mesh geometry={geometry}>
            {wireframe ? (
                <meshBasicMaterial wireframe={true} color={"#999999"} />
            ) : (
                <meshPhysicalMaterial
                    color={"#999999"}
                    envMapIntensity={1}
                    metalness={0.05}
                    roughness={0.1}
                />
            )}
        </mesh>
    )
}

const StyledDiv = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`

export const Demo = () => {
    const [showWireframe, setShowWireframe] = useState(false)
    const [animate, setAnimate] = useState(false)
    return (
        <StyledDiv>
            <div>
                <Checkbox checked={showWireframe} onChange={() => setShowWireframe(!showWireframe)}>
                    Show wireframe
                </Checkbox>
                <Checkbox checked={animate} onChange={() => setAnimate(!animate)}>
                    Animate
                </Checkbox>
            </div>
            <Canvas>
                <OrbitControls />
                <ambientLight />
                <BoxWithCutout wireframe={showWireframe} animate={animate} />
                <DefaultEnvironment />
            </Canvas>
        </StyledDiv>
    )
}
