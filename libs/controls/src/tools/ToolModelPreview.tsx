/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { DefaultGridHelper, TriadHelper } from "../scene"
import styled from "styled-components"
import { useEffect, useRef } from "react"

const StyledCanvas = styled(Canvas)`
    width: 100%;
    height: 400px !important;
    background: ${props => props.theme.colorBgBase};
    border-radius: 10px;
`

export const ToolModelPreview = ({ filename }) => {
    const model = useGLTF("/gb/" + filename, "/assets/draco/").scene.clone()

    return (
        <StyledCanvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <OrbitControls makeDefault autoRotate />
            <TriadHelper size={1} />
            <primitive object={model} scale={[20, 20, 20]} />
        </StyledCanvas>
    )
}
