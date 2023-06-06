/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Vector3 } from "three"
import React, { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useAppState } from "../store"

const POSITION_IN_SCENE = new Vector3(0.1, -0.1, 0.35)
const ROD_INITIAL_POSITION = new Vector3(0.031, 0, 0.006)

/**
 * Pneumatic pusher component, which updates based on the virtual cylinder position from the app state.
 */
export const PneumaticCylinder = () => {
    const { cylinderPosition } = useAppState()

    const [cylinder, rod] = useMemo(
        () =>
            useGLTF(
                [
                    "19204_DSNU_16_125_P_A____0_CYLINDER.glb",
                    "19204_DSNU_16_125_P_A____0_ROD.glb"
                    // @ts-ignore
                ].map(j => `${import.meta.env.BASE_URL}assets/${j}`)
            ).map(m => m.scene.clone()),
        []
    )

    const position = useMemo(() => {
        return ROD_INITIAL_POSITION.clone().setY(cylinderPosition)
    }, [cylinderPosition])

    return (
        <group position={POSITION_IN_SCENE}>
            <primitive object={cylinder} />
            <primitive object={rod} position={position} />
        </group>
    )
}
