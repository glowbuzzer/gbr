/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useDigitalInputState } from "@glowbuzzer/store"
import { DigitalInput } from "../constants"
import { Euler, Vector3 } from "three"
import { useMemo } from "react"

const ROTATION = new Euler(0, 0, -Math.PI / 24)
const BASE_POSITION = new Vector3(300, -75, 325)

/**
 * Simple laser beam component which makes up part of the magic eye sensor.
 * When the magic eye is triggered, the laser beam is shortened to make it appear as if the beam is broken.
 */
export const Laser = () => {
    const triggered = useDigitalInputState(DigitalInput.MAGIC_EYE_TRIGGERED)
    const laser_length = triggered ? 60 : 275
    const laser_position = laser_length / 2

    const [position, args] = useMemo(() => {
        return [
            new Vector3(0, laser_position, 0),
            [1, 1, laser_length, 10] as [number, number, number, number]
        ]
    }, [laser_position, laser_length])

    return (
        <group rotation={ROTATION} position={BASE_POSITION}>
            <mesh position={position}>
                <cylinderGeometry args={args}></cylinderGeometry>
                <meshBasicMaterial attach="material" color="red" />
            </mesh>
        </group>
    )
}
