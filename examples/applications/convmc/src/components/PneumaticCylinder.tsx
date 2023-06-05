/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Mesh, Vector3 } from "three"
import React, { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { appSlice, useAppState } from "../store"
import { useDispatch } from "react-redux"
import { useDigitalOutputState } from "@glowbuzzer/store"
import { DigitalOutput } from "../constants"

const POSITION_IN_SCENE = new Vector3(0.1, -0.1, 0.35)
const ROD_INITIAL_POSITION = new Vector3(0.031, 0, 0.006)

/**
 * Pneumatic pusher component. Reacts to the cylinder trigger (digital output), and animates the cylinder position.
 * The cylinder position is dispatched to the Redux store, because it is used by the conveyor belt animation to determine
 * the position of the object on the conveyor when it is being pushed.
 */
export const PneumaticCylinder = () => {
    const [{ effectiveValue: cylinderTriggered }] = useDigitalOutputState(DigitalOutput.CYLINDER)
    const dispatch = useDispatch()
    const cylinderPosition = useRef(0)
    const cylinderStepDirection = useRef(0)
    const rodRef = useRef<Mesh>()
    const { invalidate } = useThree()

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

    useFrame(state => {
        // if we're currently stepping in/out the cylinder, do the updates
        if (cylinderStepDirection.current !== 0) {
            let new_position = cylinderPosition.current + cylinderStepDirection.current
            if (new_position < 0) {
                new_position = 0
                cylinderStepDirection.current = 0
            } else if (new_position > 0.1) {
                new_position = 0.1
                cylinderStepDirection.current = 0
            }
            // update scene
            rodRef.current.position.setY(new_position)
            // update store
            dispatch(appSlice.actions.setCylinderPosition(new_position))
            // update local state
            cylinderPosition.current = new_position
            // ensure we get a new animation frame (frameloop="demand")
            invalidate()
        }
    })

    useEffect(() => {
        // if the triggered state has changed, update the step/direction of the movement
        if (cylinderTriggered && cylinderPosition.current < 0.1) {
            cylinderStepDirection.current = 0.01
            // we should get a re-render anyway, but just in case
            invalidate()
        } else if (!cylinderTriggered && cylinderPosition.current > 0) {
            cylinderStepDirection.current = -0.01
            invalidate()
        } else {
            cylinderStepDirection.current = 0
        }
    }, [cylinderTriggered])

    return (
        <group position={POSITION_IN_SCENE}>
            <primitive object={cylinder} />
            <primitive ref={rodRef} object={rod} position={ROD_INITIAL_POSITION} />
        </group>
    )
}
