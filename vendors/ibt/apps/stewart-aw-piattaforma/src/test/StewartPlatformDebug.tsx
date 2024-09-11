/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Cylinder, Sphere } from "@react-three/drei"
import { useJointPositions, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { transparent_material, useStewartPlatformInverseKinematics } from "../util"
import { Vector3 } from "three"
import { TriadHelper } from "@glowbuzzer/controls"
import React from "react"
import { PointedCylinder } from "./PointedCylinder"
import { base_coordinates, platform_coordinates } from "../config"

const base_height = 25
const platform_height = 15
const uj_base_height = 25
const uj_platform_height = 25
const joint_offset = 300 // - uj_base_height + uj_platform_height

/**
 * Renders an abstract Stewart platform where the parts are represented by primitives rather than
 * model files, and where the different elements can be sized separately. Can be useful to explore and debug
 * the kinematics without worrying about the more complex composition of the different model files.
 *
 * @constructor
 */
export const StewartPlatformDebug = () => {
    const {
        position: { translation, rotation }
    } = useKinematicsCartesianPosition(0)

    const joints = useJointPositions(0)
    const rotations = useStewartPlatformInverseKinematics()

    return (
        <group rotation={[0, 0, -Math.PI / 3]}>
            <Cylinder
                args={[250, 250, base_height, 32]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, base_height / 2]}
                material={transparent_material}
            />

            <group rotation={[0, 0, Math.PI / 3]} position={[0, 0, base_height]}>
                {base_coordinates.map((item, i) => {
                    const rod_length = (joints[i] || 0) + joint_offset
                    return (
                        <group key={i} position={item} quaternion={rotations[i].swivel}>
                            <PointedCylinder length={uj_base_height} />

                            <group quaternion={rotations[i].tilt} position={[0, 0, uj_base_height]}>
                                <TriadHelper size={50} />

                                {/*
                                    THE JOINT
                                */}
                                <PointedCylinder length={rod_length} doubleEnded />

                                <group position={[0, 0, rod_length]}>
                                    <group quaternion={rotations[i].tilt.clone().invert()}>
                                        <group quaternion={rotations[i].swivel.clone().invert()}>
                                            <group quaternion={rotation}>
                                                <group
                                                    position={[0, 0, uj_platform_height]}
                                                    rotation={[Math.PI, 0, 0]}
                                                >
                                                    <PointedCylinder length={uj_platform_height} />
                                                </group>
                                            </group>
                                        </group>
                                    </group>
                                </group>
                            </group>
                        </group>
                    )
                })}
            </group>

            <group rotation={[0, 0, Math.PI / 3]}>
                <group position={translation} quaternion={rotation}>
                    <TriadHelper size={75} />
                    <Sphere args={[5, 16, 16]}>
                        <meshBasicMaterial color="cyan" />
                    </Sphere>
                    <Cylinder
                        args={[150, 150, platform_height, 32]}
                        rotation={[Math.PI / 2, 0, 0]}
                        position={[0, 0, -platform_height / 2]}
                        material={transparent_material}
                    />

                    {platform_coordinates.map((item, i) => (
                        <Sphere
                            key={i}
                            args={[2, 16, 16]}
                            position={item.clone().add(new Vector3(0, 0, -platform_height))}
                        >
                            <meshBasicMaterial color="blue" />
                        </Sphere>
                    ))}
                </group>
            </group>
        </group>
    )
}
