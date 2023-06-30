/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { appSlice, Conveyor, ObjectType, useAppState } from "../store"
import React, { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useDispatch } from "react-redux"
import { useRawJointPositions } from "@glowbuzzer/store"
import { Vector3 } from "three"

// default object properties for the car/duck
const object_props = {
    [ObjectType.CAR]: {
        scale: [20, 20, 20],
        y: 318,
        rotation: [Math.PI / 2, Math.PI, 0]
    },
    [ObjectType.DUCK]: {
        scale: [35, 35, 35],
        y: 314,
        rotation: [Math.PI / 2, Math.PI, 0]
    }
}

/**
 * Component to render the current object on the conveyor, if any.
 * The object can be on the first or second conveyor and the object's position is determined by the joint/conveyor position.
 * When the object hits the conveyor, the conveyor's position is latched and this is used to determine the actual position in the scene.
 */
export const ObjectOnConveyor = () => {
    const { objectType, objectConveyor, objectInitialPosition, objectY, objectZ } = useAppState()
    const joints = useRawJointPositions()
    const dispatch = useDispatch()

    const [car, duck] = useMemo(
        () =>
            useGLTF(
                [
                    "uploads_files_3165473_toy+car+1.glb",
                    "Duck.glb"
                    // @ts-ignore
                ].map(j => `${import.meta.env.BASE_URL}assets/${j}`)
            ).map(m => m.scene.clone()),
        []
    )

    // determine the object's position in the scene and any other properties
    const { position, ...props } = useMemo(() => {
        if (objectType === ObjectType.NONE) {
            // no object yet
            return { position: new Vector3() }
        }
        const { y, ...props } = object_props[objectType] || {}
        const [joint1, joint2] = joints || [0, 0]

        // the object's position is determined by the joint position and the conveyor it is on
        const [jointPos, baseOffset] =
            objectConveyor === Conveyor.CONVEYOR1 ? [joint1, 600] : [joint2, 100]

        const position = new Vector3(
            objectZ === 0 ? baseOffset + (jointPos - objectInitialPosition) : 600,
            10 + objectY * 1000,
            y + objectZ
        )
        return { position, ...props }
    }, [objectConveyor, objectType, objectY, objectZ, objectInitialPosition, joints])

    useFrame((state, delta, frame) => {
        // handle the case where the object is in mid-air and has not hit the conveyor yet
        if (objectZ > 0) {
            // determine the next height of the object and dispatch the new objectZ
            const next = Math.max(0, objectZ - delta * 100)
            dispatch(appSlice.actions.setObjectZ(next))
            // if the object has hit the conveyor, latch the conveyor's position
            if (next === 0) {
                dispatch(
                    appSlice.actions.setObjectConveyor({
                        conveyor: Conveyor.CONVEYOR1,
                        position: joints[0]
                    })
                )
            }
        }
    })

    if (objectType === ObjectType.NONE) {
        return null
    }

    console.log("object position", position)
    return (
        <group>
            <primitive
                object={objectType === ObjectType.CAR ? car : duck}
                position={position}
                {...props}
            />
        </group>
    )
}
