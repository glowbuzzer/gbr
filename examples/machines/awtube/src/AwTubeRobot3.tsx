// @formatter:off
/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Euler, Quaternion, Vector3 } from "three"
import { useGLTF } from "@react-three/drei"
import { partRotations } from "./PartTranslationsRotations"
import React from "react"
import { TriadHelper } from "@glowbuzzer/controls"
import { Base, Clamp, Flange, Joint, Link, Monobraccio, Spindle } from "./parts"
import {
    translate_x,
    translate_x_y,
    translate_y,
    translate_z,
    useLoadedRobotDefinition
} from "./util"

const {
    flange0Rotation,
    j5Rotation,
    j3Rotation,
    clamp1Rotation,
    link1Rotation,
    j4Rotation,
    base0Rotation,
    clamp0Rotation,
    j1Rotation,
    flange3Rotation,
    flange2Rotation,
    j0Rotation,
    monobraccioORotation,
    flange1Rotation,
    spindle0Rotation,
    j2Rotation,
    link0Rotation
} = partRotations

function euler(position: number, axis: string) {
    return new Euler(
        axis === "X" ? position : 0,
        axis === "Y" ? position : 0,
        axis === "Z" ? position : 0
    )
}

const definition = [
    Base.MM219,
    Joint.J32,
    Clamp.J32_J32,
    Joint.J32,
    Flange.J32,
    Link.MM127_302,
    Flange.J32,
    Joint.J32,
    Clamp.J32_J25,
    Joint.J25,
    Flange.J25,
    Link.MM100_283,
    Flange.J25,
    Joint.J25,
    Monobraccio.M220,
    Joint.J20,
    Spindle.M112
]

export const LayoutAllParts = () => {
    const parts = useGLTF(
        [...Object.values(Joint)].map(p => `/assets/aw/awtube/${p.filename}`)
    ).map(m => m.scene.clone())

    return (
        <group position={[-1800, -1300, 100]} scale={1000}>
            {parts.map((part, index) => {
                const col = index % 3
                const row = Math.floor(index / 3)
                return (
                    <group key={index} position={[col * 0.4, row * 0.6, 0]}>
                        <TriadHelper size={0.3} />
                        <primitive object={part} />
                    </group>
                )
            })}
        </group>
    )
}

export const AwTubeRobot3 = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)
    const jointPositions = useJointPositions(0)

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    const [b0, j0, c0, j1, f0, l0, f1, j2, c1, j3, f2, l1, f3, j4, m0, j5, s0] =
        useLoadedRobotDefinition(definition)

    const all_parts = useLoadedRobotDefinition(definition)

    const axis_of_rotation = ["Z", "X", "X", "Y", "X", "Y"]
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

    return (
        // prettier-ignore
        <group>
            <LayoutAllParts />
            <group position={position} rotation={[0, 0, Math.PI / 2]} scale={1000}>
                <primitive object={b0.object} rotation={base0Rotation} position={[0, 0, -j0.moveableFlangeFromCentreLine - b0.thickness]} />
                <group rotation={baseRotation}>
                    {/* SEGMENT/LINK 1 */}
                    <primitive object={j0.object} rotation={j0Rotation} />

                    <group rotation={shoulderRotation} position={translate_x(j0.fixedFlangeFromCentreLine)}>
                        {/* SEGMENT/LINK 2 */}
                        <primitive object={c0.object} rotation={clamp0Rotation} />

                        <group position={translate_x(c0.thickness)}>
                            <primitive object={j1.object} rotation={j1Rotation} position={translate_x(j1.moveableFlangeFromCentreLine)} />

                            <group position={translate_x_y(j1.moveableFlangeFromCentreLine, j1.fixedFlangeFromCentreLine)}>
                                <primitive object={f0.object} rotation={flange0Rotation} />

                                <group position={translate_y(f0.offset)}>
                                    <primitive object={l0.object} rotation={link0Rotation} />

                                    <group position={translate_y(l0.length)}>
                                        <primitive object={f1.object} rotation={flange1Rotation} position={translate_y(f1.offset)} />

                                        <group position={translate_y(f1.offset)}>
                                            <primitive object={j2.object} rotation={j2Rotation} position={translate_y(j2.fixedFlangeFromCentreLine)} />

                                            <group position={translate_x_y(-j2.moveableFlangeFromCentreLine, j2.fixedFlangeFromCentreLine)} rotation={elbowRotation}>
                                                {/* SEGMENT/LINK 3 */}
                                                <primitive object={c1.object} rotation={clamp1Rotation} />

                                                <group position={translate_x(-c1.thickness)}>
                                                    <primitive object={j3.object} rotation={j3Rotation} position={translate_x(-j3.moveableFlangeFromCentreLine)} />

                                                    {/* SEGMENT/LINK 4 */}
                                                    <group position={translate_x_y(-j3.moveableFlangeFromCentreLine, j3.moveableFlangeFromCentreLine)} rotation={wristRotation}>
                                                        <primitive object={f2.object} rotation={flange2Rotation} />

                                                        <group position={translate_y(f2.offset)}>
                                                            <primitive object={l1.object} rotation={link1Rotation} />

                                                            <group position={translate_y(l1.length)}>
                                                                <primitive object={f3.object} rotation={flange3Rotation} position={translate_y(f3.offset)} />

                                                                <group position={translate_y(f3.offset)}>
                                                                    <primitive object={j4.object} rotation={j4Rotation} position={translate_y(j4.fixedFlangeFromCentreLine)} />

                                                                    <group position={translate_x_y(j4.moveableFlangeFromCentreLine, j4.fixedFlangeFromCentreLine)} rotation={handRotation}>
                                                                        {/* SEGMENT/LINK 5 */}
                                                                        <primitive object={m0.object} rotation={monobraccioORotation} />

                                                                        <group position={translate_x_y(m0.offset, m0.length)}>
                                                                            <primitive object={j5.object} rotation={j5Rotation} position={translate_x(-j5.fixedFlangeFromCentreLine)} />

                                                                            <group position={translate_x_y(-j5.fixedFlangeFromCentreLine, j5.moveableFlangeFromCentreLine)} rotation={toolRotation}>
                                                                                {/* SEGMENT/LINK 6 */}
                                                                                <primitive object={s0.object} rotation={spindle0Rotation} />

                                                                                <group position={translate_y(s0.thickness)} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={1 / 1000}>
                                                                                    {children}
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
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
