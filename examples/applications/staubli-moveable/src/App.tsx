/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { BasicRobot, RobotKinematicsChainElement, TriadHelper } from "@glowbuzzer/controls"
import { Camera, Euler, Vector3 } from "three"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { useAppState } from "./store"
import React, { useEffect, useMemo, useRef } from "react"
import { PerspectiveCamera, useGLTF } from "@react-three/drei"

const DEG90 = Math.PI / 2
const TX40_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { moveable: true },
    { rotateX: -DEG90, moveable: true, jointAngleAdjustment: -DEG90 },
    { rotateX: 0, translateX: 0.225, jointAngleAdjustment: DEG90, moveable: true },
    { rotateX: DEG90, translateZ: 0.035, moveable: true },
    { rotateX: -DEG90, translateZ: 0.225, moveable: true },
    { rotateX: DEG90, moveable: true },
    { translateZ: 0.065 }
]
const BASE_SCALE = 400
const SCALE = new Vector3(BASE_SCALE, BASE_SCALE, BASE_SCALE)

export const MoveableStaubliRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)
    const { tracking } = useAppState()

    const jointPositions = useJointPositions(0)

    // load the parts of the robot (links)
    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(m => m.scene),
        []
    )

    const baseRef = useRef()
    const trackingCamera = useRef<Camera>()

    const trackModel = useMemo(() => useGLTF("/assets/moveable_track.glb"), [])
    const baseModel = useMemo(() => useGLTF("/assets/moveable_base.glb"), [])
    const suzanneModel = useMemo(() => useGLTF("/assets/suzanne.glb"), [])

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
                <BasicRobot
                    kinematicsChain={TX40_KIN_CHAIN}
                    parts={parts}
                    jointPositions={jointPositions}
                    translation={translation}
                    rotation={rotation}
                    scale={1000}
                >
                    {tracking || <TriadHelper size={200} />}

                    <PerspectiveCamera
                        ref={trackingCamera}
                        makeDefault={tracking}
                        position={[0, 0, 0]}
                        rotation={[Math.PI, 0, 0]}
                    />
                </BasicRobot>
            </group>
            <primitive
                scale={[400, 400, 400]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[-500, 1800, 600]}
                object={suzanneModel.scene}
            />
            <primitive
                scale={[400, 400, 400]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[500, 1800, 600]}
                object={suzanneModel.scene.clone()}
            />
        </>
    )
}
