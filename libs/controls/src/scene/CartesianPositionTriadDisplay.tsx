/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useMemo, useRef, useState } from "react"
import { Sphere } from "@react-three/drei"
import { CartesianPositionPopover } from "./CartesianPositionPopover"
import { ThreeEvent } from "@react-three/fiber"
import { MeshBasicMaterial, Quaternion, Vector3 } from "three"
import { TriadHelper } from "./TriadHelper"
import { useTheme } from "styled-components"
import { useScale } from "../util"

type CartesianPositionTriadDisplayProps = {
    name: string
    selected: boolean
    size: "regular" | "small"
    translation: Vector3
    rotation: Quaternion
    frameIndex?: number
    onClick: () => void
}

export const CartesianPositionTriadDisplay = ({
    name,
    selected,
    size,
    translation,
    rotation,
    onClick
}: CartesianPositionTriadDisplayProps) => {
    const { extent } = useScale()
    const [hoverPoint, setHoverPoint] = useState<Vector3>(null)
    const token = useTheme()

    const debounceTimer = useRef(null)

    const [mat_solid_black, mat_semi_transparent] = useMemo(() => {
        return [
            new MeshBasicMaterial({
                color: token.colorTextBase,
                transparent: true,
                opacity: 0.7
            }),
            new MeshBasicMaterial({
                color: token.colorTextBase,
                transparent: true,
                opacity: 0.2
            })
        ]
    }, [token])

    const sphere_size = extent / 200

    function on_mouse_enter(e: ThreeEvent<PointerEvent>) {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }
        setHoverPoint(e.point)
    }

    function on_mouse_leave() {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }
        debounceTimer.current = setTimeout(() => {
            setHoverPoint(null)
        }, 250)
    }

    return (
        <group>
            <group
                position={translation}
                quaternion={rotation}
                onPointerOver={on_mouse_enter}
                onPointerOut={on_mouse_leave}
                onClick={onClick}
            >
                <TriadHelper
                    size={extent / (size === "regular" ? 5 : 10)}
                    opacity={selected ? 1 : 0.3}
                />
                <Sphere
                    args={[sphere_size, sphere_size, sphere_size]}
                    position={[0, 0, 0]}
                    material={selected ? mat_solid_black : mat_semi_transparent}
                />
            </group>
            {hoverPoint && (
                <CartesianPositionPopover
                    name={name}
                    translation={translation}
                    rotation={rotation}
                    point={hoverPoint}
                />
            )}
        </group>
    )
}
