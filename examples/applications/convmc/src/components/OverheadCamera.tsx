/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { PerspectiveCamera } from "@react-three/drei"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { appSlice, ObjectType, useAppState } from "../store"
import { Camera, Euler, Vector3 } from "three"
import { useDigitalOutputState } from "@glowbuzzer/store"
import { DigitalOutput } from "../constants"
import { useFrame, useThree } from "@react-three/fiber"
import { useDispatch } from "react-redux"
import { dominant_color, to_object_type } from "../histogram"

const POS_X = 320
const ROTATION = new Euler(Math.PI, 0, 0)

/**
 * This is an overhead camera that replaces the default camera when the overhead camera is triggered.
 * It takes a snapshot of the scene and determines the type of object on the conveyor by looking at the dominant color.
 */
export const OverheadCamera = () => {
    const [{ effectiveValue: overheadCamera }] = useDigitalOutputState(DigitalOutput.CAMERA_TRIGGER)
    const [enabled, setEnabled] = useState(false)
    const camera = useRef<Camera>()
    const { gl } = useThree()
    const dispatch = useDispatch()
    const takeSnapshot = useRef(false)

    useEffect(() => {
        if (overheadCamera) {
            // ensure the camera is looking straight down at the conveyor
            camera.current.lookAt(new Vector3(POS_X - 200, 0, 0))
            // set transient flag to take a snapshot
            takeSnapshot.current = true
            // enable the camera so that it replaces the default camera
            setEnabled(true)
        } else {
            // disable the camera
            setEnabled(false)
        }
    }, [overheadCamera])

    useFrame(root => {
        if (takeSnapshot.current) {
            // take a snapshot of the scene
            const gl = root.gl
            gl.render(root.scene, root.camera)
            const canvas = gl.domElement
            const pixels = new Uint8Array(canvas.width * canvas.height * 4)
            const context = canvas.getContext("webgl2")
            context.readPixels(
                0,
                0,
                canvas.width,
                canvas.height,
                context.RGBA,
                context.UNSIGNED_BYTE,
                pixels
            )
            // determine the type of object on the conveyor
            const c = dominant_color(pixels, canvas.width, canvas.height)
            const type = to_object_type(c)
            // pause for effect and then set the object type
            setTimeout(() => {
                dispatch(appSlice.actions.setDetectedObjectType(type))
            }, 2000)
            // reset the transient flag (we only want to do this once)
            takeSnapshot.current = false
        }
    })

    const position = useMemo(() => new Vector3(POS_X, 10, 450), [POS_X])
    return (
        <PerspectiveCamera
            ref={camera}
            near={1}
            far={10000}
            makeDefault={enabled}
            position={position}
            rotation={ROTATION}
        />
    )
}
