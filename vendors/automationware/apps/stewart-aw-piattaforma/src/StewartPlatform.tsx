/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useJointPositions, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import React, { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { base_coordinates, joint_offset } from "./config"
import { useStewartPlatformInverseKinematics } from "./util"

// the origin of the platform glb is on the bottom face of the disk, which is 12mm thick
const platform_thickness = 12

export const StewartPlatform = ({ children }) => {
    const {
        position: { translation, rotation }
    } = useKinematicsCartesianPosition(0)

    const joints = useJointPositions(0)

    // TODO: H: HACK ALERT - REMOVE THIS
    if (translation.length() === 0) {
        translation.set(0, 0, 300)
    }

    const [base, platform, bottomRod, topRod, uj] = useMemo(
        () =>
            useGLTF(
                [
                    "/assets/base.glb",
                    "/assets/platform.glb",
                    "/assets/cylinder body.glb",
                    "/assets/piston.glb",
                    "/assets/uj.glb"
                ],
                "/assets/draco/"
            ).map(({ scene }) => {
                scene.scale.copy(new THREE.Vector3(1000, 1000, 1000))
                return scene
            }),
        []
    )

    // we need to make copies of some of the parts to render them separately
    const parts = useMemo(() => {
        return new Array(6).fill(0).map(() => ({
            bottomRod: bottomRod.clone(),
            topRod: topRod.clone(),
            ujBaseLower: uj.clone(),
            ujBaseUpper: uj.clone(),
            ujPlatformLower: uj.clone(),
            ujPlatformUpper: uj.clone()
        }))
    }, [bottomRod, topRod, uj])

    // gives us various rotations we need for the visualisation
    // duplicates the IK done by GBC but provides more information
    const rotations = useStewartPlatformInverseKinematics()

    /**
     * Here we render two distinct groups. The first contains everything except the platform itself.
     * The second is the platform, which is simply rendered with the translation and rotation from the
     * cartesian position given by the status from GBC.
     *
     * In the first group we compose base, base UJs, rods, and platform UJs. The various swivel, tilt,
     * and twist angles are produced as part of the hexapod IK calculations. The end result of this composition
     * must match the position and rotations of the mount points on the platform.
     */
    return (
        <group>
            <primitive position={[-90, 0, 0]} rotation={[Math.PI, 0, Math.PI]} object={base} />

            <group position={[0, 0, 30]}>
                {base_coordinates.map((item, i) => {
                    const rod_length = (joints[i] || 0) + joint_offset

                    return (
                        <group key={i} position={item} quaternion={rotations[i].swivel}>
                            <primitive
                                object={parts[i].ujBaseLower}
                                rotation={[0, Math.PI / 2, 0]}
                            />

                            <group quaternion={rotations[i].tilt} position={[0, 0, 20]}>
                                <group rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                                    <primitive
                                        object={parts[i].ujBaseUpper}
                                        position={[20, 0, 0]}
                                    />
                                </group>
                                <group quaternion={rotations[i].rod_twist}>
                                    <primitive
                                        object={parts[i].bottomRod}
                                        rotation={[Math.PI / 2, 0, 0]}
                                        position={[0, 0, 10]}
                                    />
                                </group>

                                <group position={[0, 0, rod_length]}>
                                    <primitive
                                        object={parts[i].ujPlatformLower}
                                        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                                        position={[0, 0, -20]}
                                    />
                                    <group quaternion={rotations[i].swivel_tilt_inverse}>
                                        <group quaternion={rotation}>
                                            <group
                                                quaternion={rotations[i].uj_platform_upper_twist}
                                            >
                                                <group rotation={[0, -Math.PI / 2, 0]}>
                                                    <primitive
                                                        object={parts[i].ujPlatformUpper}
                                                        position={[20, 0, 0]}
                                                    />
                                                </group>
                                            </group>
                                        </group>
                                    </group>
                                </group>

                                <group position={[0, 0, (joints[i] || 0) + 138]}>
                                    <primitive
                                        object={parts[i].topRod}
                                        rotation={[Math.PI / 2, 0, 0]}
                                    />
                                </group>
                            </group>
                        </group>
                    )
                })}
            </group>

            <group position={translation} quaternion={rotation}>
                <group
                    rotation={[0, 0, -Math.PI / 6 /* =30 deg rotation */]}
                    position={[0, 0, -platform_thickness]}
                >
                    <primitive object={platform} rotation={[Math.PI / 2, 0, 0]} />
                </group>
                {children}
            </group>
        </group>
    )
}
