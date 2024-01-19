import React, { ReactNode, useMemo } from "react"
import { Quaternion, Vector3 } from "three"
import { useFrame, useKinematicsConfiguration } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"
import { KinematicsGroup } from "./kinematics/KinematicsGroup"
import { KinChainProvider } from "./kinematics/KinChainProvider"

export const StaubliRobot = ({
    kinematicsConfigurationIndex,
    jointPositions,
    children
}: {
    kinematicsConfigurationIndex: number
    jointPositions?: number[]
    children?: ReactNode
}) => {
    const kinematicsConfiguration = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { translation, rotation } = useFrame(frameIndex, false)

    const dh = kinematicsConfiguration.kinChainParams
    if (dh.numCols !== 5 || dh.numRows !== 6) {
        throw new Error("Invalid kin chain params for Staubli robot!")
    }

    // load the parts of the robot (links)
    const [base, p0, p1, p2, p3, p4, p5] = useMemo(
        () =>
            useGLTF(
                // @ts-ignore
                [0, 1, 2, 3, 4, 5, 6].map(j => `${import.meta.env.BASE_URL}assets/tx40/L${j}.glb`)
            ).map(m => m.scene.clone()),
        []
    )

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    /**
     * Construct the robot from the parts and apply the joint positions.
     *
     * The outer group at each level is used to orientate and offset the part to the correct position ready to
     * mount the part itself. These adjustments are to do with how the parts were modelled and are not related to the kinematics.
     *
     * The joint rotations are applied to the inner group at each level (to the Z axis).
     */
    return (
        <KinChainProvider kinematicsConfigurationIndex={kinematicsConfigurationIndex}>
            {/*
            <LayoutObjectGrid objects={[base, p0, p1, p2, p3, p4, p5]} />
*/}

            <group position={position} quaternion={quaternion} scale={1000}>
                <primitive object={base} />
                <KinematicsGroup jointIndex={0} part={p0}>
                    <KinematicsGroup jointIndex={1} part={p1}>
                        <KinematicsGroup jointIndex={2} part={p2}>
                            <KinematicsGroup jointIndex={3} part={p3}>
                                <KinematicsGroup jointIndex={4} part={p4}>
                                    <KinematicsGroup jointIndex={5} part={p5}>
                                        <group scale={1 / 1000}>{children}</group>
                                    </KinematicsGroup>
                                </KinematicsGroup>
                            </KinematicsGroup>
                        </KinematicsGroup>
                    </KinematicsGroup>
                </KinematicsGroup>
            </group>
        </KinChainProvider>
    )
}
