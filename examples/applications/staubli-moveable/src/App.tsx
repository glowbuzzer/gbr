/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { TriadHelper } from "@glowbuzzer/controls"
import { Camera, Euler, Vector3 } from "three"
import { useJointPositions } from "@glowbuzzer/store"
import { useAppState } from "./store"
import React, { useEffect, useMemo, useRef } from "react"
import { PerspectiveCamera, useGLTF } from "@react-three/drei"
import { Kamdo } from "./Kamdo"
import { StaubliRobot } from "../../../util/StaubliRobot"

const BASE_SCALE = 400
const SCALE = new Vector3(BASE_SCALE, BASE_SCALE, BASE_SCALE)

export const MoveableStaubliRobot = () => {
    const { tracking } = useAppState()

    const jointPositions = useJointPositions(0)

    // load the parts of the robot (links)
    const baseRef = useRef()
    const trackingCamera = useRef<Camera>()

    const trackModel = useMemo(() => useGLTF("/assets/moveable_track.glb"), [])
    const baseModel = useMemo(() => useGLTF("/assets/moveable_base.glb"), [])

    useEffect(() => {
        trackingCamera.current.position.set(0, 0, 300)
        trackingCamera.current.setRotationFromEuler(new Euler(Math.PI, 0, 0))
        trackingCamera.current.updateMatrixWorld(true)
    }, [tracking])

    return (
        <>
            <primitive
                scale={SCALE}
                rotation={[0, Math.PI, Math.PI / 2]}
                position={[-BASE_SCALE * 4, 0, 0]}
                object={trackModel.scene}
            />
            <group position={[jointPositions[6] || 0, 0, BASE_SCALE - 100]}>
                <primitive
                    ref={baseRef}
                    scale={SCALE}
                    position={[0, 0, 0]}
                    rotation={[0, Math.PI, Math.PI / 2]}
                    object={baseModel.scene}
                />
                <StaubliRobot kinematicsConfigurationIndex={0}>
                    {tracking || <TriadHelper size={200} />}
                    <PerspectiveCamera
                        ref={trackingCamera}
                        near={1}
                        far={10000}
                        makeDefault={tracking}
                        position={[0, 0, 0]}
                        rotation={[Math.PI, 0, 0]}
                    />
                </StaubliRobot>
            </group>
            <Kamdo position={[-500, 2000, 0]} />
            <Kamdo position={[500, 2000, 0]} />
        </>
    )
}
