import { BasicRobot, CylindricalTool, RobotKinematicsChainElement } from "@glowbuzzer/controls"
import { Vector3 } from "three"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import React, { ReactNode, useMemo } from "react"
import { useGLTF } from "@react-three/drei"

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

const DEFAULT_POSITION = new Vector3(0, 0, 325)

export const StaubliRobot = ({
    kinematicsConfigurationIndex,
    children
}: {
    kinematicsConfigurationIndex: number
    children?: ReactNode
}) => {
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { translation, rotation } = useFrame(frameIndex, false)

    const jointPositions = useJointPositions(kinematicsConfigurationIndex)

    // load the parts of the robot (links)
    const parts = useMemo(
        () =>
            useGLTF(
                // @ts-ignore
                [0, 1, 2, 3, 4, 5, 6].map(j => `${import.meta.env.BASE_URL}assets/tx40/L${j}.glb`)
            ).map(m => m.scene.clone()),
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
            {children || <CylindricalTool toolIndex={0} />}
        </BasicRobot>
    )
}
