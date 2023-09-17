/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Euler, Group } from "three"
import { partRotations, partTranslations } from "./PartTranslationsRotations"
import { getPartProperty } from "./GetPartProperty"
import { PartTypes, awMediumRobotArmParts, awPartDataLibrary, PartInfoKey } from "./PartData"

type Axis = "X" | "Y" | "Z"

// simple function to create Euler for a single axis of rotation
function euler(position: number, axis: Axis) {
    return new Euler(
        axis === "X" ? position : 0,
        axis === "Y" ? position : 0,
        axis === "Z" ? position : 0
    )
}

//set the object that contains the definition of the parts used in a concrete robot arm
const robotArmPartsUsed = awMediumRobotArmParts

//set the object that contains the library of parts
const robotArmPartsLib = awPartDataLibrary

// const createPartGroup = (
//     partTypeIndexes: { partType: string; partIndex: number }[],
//     scale: number = 1000
// ) => {
//     // const partGroups: Group[] = []
//     const groupOfParts = new Group()
//     groupOfParts.scale.set(scale, scale, scale)
//
//     partTypeIndexes.forEach(({ partType, partIndex }, index) => {
//         const filename = getPartProperty(
//             robotArmPartsUsed,
//             robotArmPartsLib,
//             partType,
//             partIndex,
//             PartInfoKey.Filename
//         )
//         if (filename) {
//             const part = useGLTF(`/assets/aw/awtube/${partType}/${filename}`)
//             if (part) {
//                 groupOfParts.add(part.scene.clone())
//             } else {
//                 console.error("Part not found", partType, partIndex)
//             }
//         } else {
//             console.error("Filename not found", partType, partIndex)
//         }
//     })
//     return groupOfParts
// }

const createPartGroup = (
    partTypeIndexes: { partType: string; partIndex: number }[],
    scale: number = 1000
) => {
    const groupOfParts = new Group()
    groupOfParts.scale.set(scale, scale, scale)

    partTypeIndexes.forEach(({ partType, partIndex }) => {
        const filename = getPartFilename(partType, partIndex)
        if (filename) {
            const part = loadPart(`/assets/aw/awtube/${partType}/${filename}`)
            if (part) {
                groupOfParts.add(part.clone())
            } else {
                console.error("Part not found:", partType, partIndex)
            }
        } else {
            console.error("Filename not found:", partType, partIndex)
        }
    })

    return groupOfParts
}

const getPartFilename = (partType: string, partIndex: number) => {
    return getPartProperty(
        robotArmPartsUsed,
        robotArmPartsLib,
        partType,
        partIndex,
        PartInfoKey.Filename
    )
}

const loadPart = (path: string) => {
    try {
        const part = useGLTF(path)
        return part ? part.scene : null
    } catch (error) {
        console.error("Error loading part:", error)
        return null
    }
}

/**
 * Load the robot parts and position them according to the joint positions
 * @param children - children to render at the TCP of the robot
 */
export const AwTubeRobot = ({ children }) => {
    const jointPositions = useJointPositions(0)
    // get the frame index and frame for the robot's kinematics configuration
    // (this allows us to position the robot in the scene)
    const { frameIndex } = useKinematicsConfiguration(0)
    const frame = useFrame(frameIndex, false)

    const [base, j0, c0, j1, f0, l0, f1, j2, c1, j3, f2, l1, f3, j4, m0, j5, s0] = useMemo(() => {
        const base = createPartGroup([{ partType: PartTypes.Bases, partIndex: 0 }])
        const j0 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 0 }])
        const c0 = createPartGroup([{ partType: PartTypes.Clamps, partIndex: 0 }])
        const j1 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 1 }])
        const f0 = createPartGroup([{ partType: PartTypes.Flanges, partIndex: 0 }])
        const l0 = createPartGroup([{ partType: PartTypes.Links, partIndex: 0 }])
        const f1 = createPartGroup([{ partType: PartTypes.Flanges, partIndex: 1 }])
        const j2 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 2 }])
        const c1 = createPartGroup([{ partType: PartTypes.Clamps, partIndex: 1 }])
        const j3 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 3 }])
        const f2 = createPartGroup([{ partType: PartTypes.Flanges, partIndex: 2 }])
        const l1 = createPartGroup([{ partType: PartTypes.Links, partIndex: 1 }])
        const f3 = createPartGroup([{ partType: PartTypes.Flanges, partIndex: 3 }])
        const j4 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 4 }])
        const m0 = createPartGroup([{ partType: PartTypes.Monobraccios, partIndex: 0 }])
        const j5 = createPartGroup([{ partType: PartTypes.Joints, partIndex: 5 }])
        const s0 = createPartGroup([{ partType: PartTypes.Spindles, partIndex: 0 }])
        return [base, j0, c0, j1, f0, l0, f1, j2, c1, j3, f2, l1, f3, j4, m0, j5, s0]
    }, [robotArmPartsUsed, robotArmPartsLib])

    // create Euler rotations for each joint
    const axis_of_rotation: Axis[] = ["Z", "X", "X", "Y", "X", "Y"]
    const [
        baseRotation,
        shoulderRotation,
        elbowRotation,
        wristRotation,
        handRotation,
        toolRotation
    ] = jointPositions.map((p, i) => euler(p, axis_of_rotation[i]))

    const j1RotationCorrection = Math.PI / 2

    // apply the rotation corrections to the joints
    shoulderRotation.x += j1RotationCorrection

    // get the translation from the frame, in order to position the robot
    const { x, y, z } = frame.translation

    // stack the parts together in nested groups to create the robot
    return (
        <group position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <primitive
                object={base}
                rotation={partRotations.base0Rotation}
                position={[
                    -partTranslations.base0Translation[0],
                    -partTranslations.base0Translation[1],
                    -partTranslations.base0Translation[2]
                ]}
            />
            <group
                rotation={baseRotation}
                // position={[
                //     partTranslations.base0Translation[0],
                //     partTranslations.base0Translation[1],
                //     partTranslations.base0Translation[2]
                // ]}
            >
                <primitive object={j0} rotation={partRotations.j0Rotation} />
                <group
                    rotation={shoulderRotation}
                    position={[
                        getPartProperty(
                            robotArmPartsUsed,
                            robotArmPartsLib,
                            PartTypes.Joints,
                            0,
                            PartInfoKey.FixedFlangeFromCentreLine
                        ) as number,
                        0,
                        0
                    ]}
                >
                    <primitive object={c0} rotation={partRotations.clamp0Rotation} />
                    <primitive
                        object={j1}
                        rotation={partRotations.j1Rotation}
                        position={partTranslations.j1Translation}
                    />
                    <primitive
                        object={f0}
                        rotation={partRotations.flange0Rotation}
                        position={partTranslations.flange0Translation}
                    />
                    <primitive
                        object={l0}
                        rotation={partRotations.link0Rotation}
                        position={partTranslations.link0Translation}
                    />
                    <primitive
                        object={f1}
                        rotation={partRotations.flange1Rotation}
                        position={partTranslations.flange1Translation}
                    />
                    <primitive
                        object={j2}
                        rotation={partRotations.j2Rotation}
                        position={partTranslations.j2Translation}
                    />

                    <group
                        rotation={elbowRotation}
                        position={[
                            0,
                            getPartProperty(
                                robotArmPartsUsed,
                                robotArmPartsLib,
                                PartTypes.Links,
                                0,
                                PartInfoKey.EffectiveLength
                            ) as number,
                            0
                        ]}
                    >
                        <primitive
                            object={c1}
                            rotation={partRotations.clamp1Rotation}
                            position={partTranslations.clamp1Translation}
                        />
                        <primitive
                            object={j3}
                            rotation={partRotations.j3Rotation}
                            position={partTranslations.j3Translation}
                        />
                        <group
                            rotation={wristRotation}
                            position={[partTranslations.j3Translation[0], 0, 0]}
                        >
                            <primitive
                                object={f2}
                                rotation={partRotations.flange2Rotation}
                                position={partTranslations.flange2Translation}
                            />
                            <primitive
                                object={l1}
                                rotation={partRotations.link1Rotation}
                                position={partTranslations.link1Translation}
                            />
                            <primitive
                                object={f3}
                                rotation={partRotations.flange3Rotation}
                                position={partTranslations.flange3Translation}
                            />
                            <primitive
                                object={j4}
                                rotation={partRotations.j4Rotation}
                                position={partTranslations.j4Translation}
                            />

                            <group
                                rotation={handRotation}
                                position={[
                                    0,
                                    getPartProperty(
                                        robotArmPartsUsed,
                                        robotArmPartsLib,
                                        PartTypes.Links,
                                        1,
                                        PartInfoKey.EffectiveLength
                                    ) as number,
                                    0
                                ]}
                            >
                                <primitive
                                    object={m0}
                                    rotation={partRotations.monobraccioORotation}
                                    position={partTranslations.monobraccioOTranslation}
                                />
                                <primitive
                                    object={j5}
                                    rotation={partRotations.j5Rotation}
                                    position={partTranslations.j5Translation}
                                />
                                <group
                                    rotation={toolRotation}
                                    position={[
                                        0,
                                        (getPartProperty(
                                            robotArmPartsUsed,
                                            robotArmPartsLib,
                                            PartTypes.Monobraccios,
                                            0,
                                            PartInfoKey.EffectiveLength
                                        ) as number) +
                                            (getPartProperty(
                                                robotArmPartsUsed,
                                                robotArmPartsLib,
                                                PartTypes.Joints,
                                                5,
                                                PartInfoKey.MoveableFlangeFromCentreLine
                                            ) as number),
                                        0
                                    ]}
                                >
                                    <primitive object={s0} />
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
