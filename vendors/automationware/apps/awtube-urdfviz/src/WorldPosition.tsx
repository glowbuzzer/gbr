/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useRef, useState } from "react"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Euler, Group, Quaternion, Vector3 } from "three"
import styled from "styled-components"
import { usePrefs } from "@glowbuzzer/store"

const StyledGrid = styled.div<{ position: "left" | "right" }>`
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 12px;
    user-select: none;
    transform: translate(
        ${props => (props.position === "right" ? "45px" : "calc(-100% - 45px)")},
        -55px
    );
    border-radius: 10px;

    .title {
        text-align: center;
        padding-bottom: 5px;
    }
    .grid {
        display: grid;
        column-gap: 8px;
        text-align: right;
        grid-template-rows: repeat(4, auto);
        grid-auto-flow: column;
    }
`

export const WorldPosition = ({
    title,
    position
}: {
    title: string
    position: "left" | "right"
}) => {
    const [pos, setPos] = useState<{ translation: Vector3; rotation: Euler }>(null)
    const componentRef = useRef<Group>(null)
    const prefs = usePrefs()

    useFrame(() => {
        const np = new Vector3()
        const nq = new Quaternion()
        componentRef.current.getWorldPosition(np)
        componentRef.current.getWorldQuaternion(nq)
        setPos({
            translation: np,
            rotation: new Euler().setFromQuaternion(nq)
        })
    })

    return (
        <group ref={componentRef}>
            {pos && (
                <Html>
                    <StyledGrid position={position}>
                        <div className="title">{title}</div>
                        <div className="grid">
                            <div></div>
                            <div>X</div>
                            <div>Y</div>
                            <div>Z</div>
                            <div>POS</div>
                            <div>{pos.translation.x.toFixed(2)}</div>
                            <div>{pos.translation.y.toFixed(2)}</div>
                            <div>{pos.translation.z.toFixed(2)}</div>
                            <div>ROT</div>
                            <div>{prefs.fromSI(pos.rotation.x, "angular").toFixed(2)}</div>
                            <div>{prefs.fromSI(pos.rotation.y, "angular").toFixed(2)}</div>
                            <div>{prefs.fromSI(pos.rotation.z, "angular").toFixed(2)}</div>
                        </div>
                    </StyledGrid>
                </Html>
            )}
        </group>
    )
}
