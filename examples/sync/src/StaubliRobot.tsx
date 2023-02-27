/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    useFrame,
    useJointPositions,
    useKinematicsConfiguration,
    useToolIndex
} from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"
import { BasicRobot, RobotKinematicsChainElement, TriadHelper } from "@glowbuzzer/controls"
import React, { useMemo } from "react"
import { Vector3 } from "three"

const TX40_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { moveable: true },
    { rotateX: -(Math.PI / 2), moveable: true, jointAngleAdjustment: -(Math.PI / 2) },
    { rotateX: 0, translateX: 0.225, jointAngleAdjustment: Math.PI / 2, moveable: true },
    { rotateX: Math.PI / 2, translateZ: 0.035, moveable: true },
    { rotateX: -(Math.PI / 2), translateZ: 0.225, moveable: true },
    { rotateX: Math.PI / 2, moveable: true },
    { translateZ: 0.065 }
]

const DEFAULT_POSITION = new Vector3(0, 0, 325)

export const StaubliRobot = () => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)
    const jointPositions = useJointPositions(0)

    // noinspection HttpUrlsUsage
    const base =
        window.location.protocol === "https:"
            ? "https://static.glowbuzzer.com"
            : "http://static.glowbuzzer.com"

    // load the parts of the robot (links)
    const parts = useMemo(
        () =>
            useGLTF(
                [0, 1, 2, 3, 4, 5, 6].map(j => `${base}/assets/models/staubli_tx40/L${j}.glb`)
            ).map(m => m.scene),
        []
    )

    return (
        <BasicRobot
            kinematicsChain={TX40_KIN_CHAIN}
            parts={parts}
            jointPositions={jointPositions}
            translation={translation || DEFAULT_POSITION}
            rotation={rotation}
            scale={1000}
        >
            <TriadHelper size={200} />
        </BasicRobot>
    )
}
