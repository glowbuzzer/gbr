import React, { ReactNode, useMemo } from "react"
import { CylindricalTool } from "@glowbuzzer/controls"
import { Quaternion, Vector3 } from "three"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils"

const DEG90 = Math.PI / 2

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
    const currentJointPositions = useJointPositions(kinematicsConfigurationIndex)
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { translation, rotation } = useFrame(frameIndex, false)

    const dh = kinematicsConfiguration.kinChainParams
    if (dh.numCols !== 5 || dh.numRows !== 6) {
        throw new Error("Invalid kin chain params for Staubli robot!")
    }

    const jointOffsets = [0, 1, 2, 3, 4, 5].map(i => degToRad(dh.data[i * 5 + 1]))

    // joint positions adjusted with joint offsets from dh matrix
    const [j0, j1, j2, j3, j4, j5] = (jointPositions || currentJointPositions).map(
        (v, i) => v + jointOffsets[i]
    )

    // load the parts of the robot (links)
    const [p0, p1, p2, p3, p4, p5, p6] = useMemo(
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
        <group position={position} quaternion={quaternion} scale={1000}>
            <primitive object={p0} />
            <group rotation={[0, 0, j0]}>
                <primitive object={p1} />
                <group rotation={[-DEG90, 0, 0]}>
                    <group rotation={[0, 0, j1]}>
                        <primitive object={p2} />
                        <group position={[0.225, 0, 0]}>
                            <group rotation={[0, 0, j2]}>
                                <primitive object={p3} />
                                <group position={[0, 0, 0.035]} rotation={[DEG90, 0, 0]}>
                                    <group rotation={[0, 0, j3]}>
                                        <primitive object={p4} />
                                        <group position={[0, 0, 0.225]} rotation={[-DEG90, 0, 0]}>
                                            <group rotation={[0, 0, j4]}>
                                                <primitive object={p5} />
                                                <group rotation={[DEG90, 0, 0]}>
                                                    <group rotation={[0, 0, j5]}>
                                                        <primitive object={p6} />
                                                        <group
                                                            position={[0, 0, 0.065]}
                                                            scale={1 / 1000}
                                                        >
                                                            {children || (
                                                                <CylindricalTool toolIndex={0} />
                                                            )}
                                                        </group>
                                                    </group>
                                                </group>
                                            </group>
                                        </group>
                                    </group>
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
