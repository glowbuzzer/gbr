/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Base, Clamp, Flange, Joint, Link, Monobraccio, Spindle } from "./parts"
import { TriadHelper } from "@glowbuzzer/controls"
import React from "react"
import { useFrame, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { KinChainProvider } from "../../../util/kinematics/KinChainProvider"
import { partRotations } from "./PartTranslationsRotations"
import {
    LoadedPartDefinition,
    PartDefinitionForBase,
    PartDefinitionForClamp,
    PartDefinitionForFlange,
    PartDefinitionForJoint,
    PartDefinitionForLink,
    PartDefinitionForMonobraccio,
    PartDefinitionForSpindle
} from "./types"
import {
    translate_x,
    translate_x_y,
    translate_y,
    translate_z,
    useLoadedRobotDefinition
} from "./util"
import { AwKinematicsGroup } from "./AwKinematicsGroup"
import { LayoutAllParts } from "./AwTubeRobot3"
import { Sphere } from "@react-three/drei"

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

const {
    flange0Rotation,
    j5Rotation,
    j3Rotation,
    clamp1Rotation,
    link1Rotation,
    j4Rotation,
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

type NamedLoadedRobotDefinition = {
    b0: LoadedPartDefinition<PartDefinitionForBase>
    j0: LoadedPartDefinition<PartDefinitionForJoint>
    c0: LoadedPartDefinition<PartDefinitionForClamp>
    j1: LoadedPartDefinition<PartDefinitionForJoint>
    f0: LoadedPartDefinition<PartDefinitionForFlange>
    l0: LoadedPartDefinition<PartDefinitionForLink>
    f1: LoadedPartDefinition<PartDefinitionForFlange>
    j2: LoadedPartDefinition<PartDefinitionForJoint>
    c1: LoadedPartDefinition<PartDefinitionForClamp>
    j3: LoadedPartDefinition<PartDefinitionForJoint>
    f2: LoadedPartDefinition<PartDefinitionForFlange>
    l1: LoadedPartDefinition<PartDefinitionForLink>
    f3: LoadedPartDefinition<PartDefinitionForFlange>
    j4: LoadedPartDefinition<PartDefinitionForJoint>
    m0: LoadedPartDefinition<PartDefinitionForMonobraccio>
    j5: LoadedPartDefinition<PartDefinitionForJoint>
    s0: LoadedPartDefinition<PartDefinitionForSpindle>
}

const BaseSegment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { b0, j0 } = parts

    return (
        <primitive
            object={b0.object}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -j0.moveableFlangeFromCentreLine - b0.thickness]}
        />
    )
}

const Joint1Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { j0 } = parts
    return (
        <group>
            <primitive object={j0.object} rotation={[0, -Math.PI / 2, Math.PI / 2]} />
        </group>
    )
}

const Joint2Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { j0, c0, j1, f0, l0, f1, j2 } = parts
    return (
        <group>
            <group
                position={translate_z(j0.fixedFlangeFromCentreLine)}
                rotation={[Math.PI / 2, Math.PI, Math.PI / 2]}
            >
                <primitive object={c0.object} rotation={clamp0Rotation} />

                <group position={translate_x(c0.thickness)}>
                    <primitive
                        object={j1.object}
                        rotation={j1Rotation}
                        position={translate_x(j1.moveableFlangeFromCentreLine)}
                    />

                    <group
                        position={translate_x_y(
                            j1.moveableFlangeFromCentreLine,
                            j1.fixedFlangeFromCentreLine
                        )}
                    >
                        <primitive object={f0.object} rotation={flange0Rotation} />

                        <group position={translate_y(f0.offset)}>
                            <primitive object={l0.object} rotation={link0Rotation} />

                            <group position={translate_y(l0.length)}>
                                <primitive
                                    object={f1.object}
                                    rotation={flange1Rotation}
                                    position={translate_y(f1.offset)}
                                />

                                <group position={translate_y(f1.offset)}>
                                    <primitive
                                        object={j2.object}
                                        rotation={j2Rotation}
                                        position={translate_y(j2.fixedFlangeFromCentreLine)}
                                    />
                                    <TriadHelper size={0.2} />
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}

const Joint3Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { j2, c1, j3, f2, l1, f3, j4 } = parts
    return (
        <group>
            <TriadHelper size={0.4} />
            <group
                rotation={[Math.PI / 2, Math.PI / 2, Math.PI / 2]}
                position={translate_z(j2.moveableFlangeFromCentreLine + c1.thickness)}
            >
                <primitive object={c1.object} rotation={clamp1Rotation} />

                <group position={translate_x(-c1.thickness)}>
                    <primitive
                        object={j3.object}
                        rotation={j3Rotation}
                        position={translate_x(-j3.moveableFlangeFromCentreLine)}
                    />
                </group>
            </group>
        </group>
    )
}

const Joint4Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { j3, f2, l1, f3, j4 } = parts
    return (
        <group>
            <TriadHelper size={0.4} />
            <group
                rotation={[Math.PI / 2, Math.PI / 2, 0]}
                position={translate_z(j3.moveableFlangeFromCentreLine)}
                // position={translate_x_y(
                //     -j3.moveableFlangeFromCentreLine,
                //     j3.moveableFlangeFromCentreLine
                // )}
            >
                <primitive object={f2.object} rotation={flange2Rotation} />

                <group position={translate_y(f2.offset)}>
                    <primitive object={l1.object} rotation={link1Rotation} />

                    <group position={translate_y(l1.length)}>
                        <primitive
                            object={f3.object}
                            rotation={flange3Rotation}
                            position={translate_y(f3.offset)}
                        />

                        <group position={translate_y(f3.offset)}>
                            <primitive
                                object={j4.object}
                                rotation={j4Rotation}
                                position={translate_y(j4.fixedFlangeFromCentreLine)}
                            />
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}

const Joint5Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { j4, m0, j5 } = parts
    // prettier-ignore
    return (
        <group rotation={[Math.PI, Math.PI / 2, 0]} position={translate_z(j4.moveableFlangeFromCentreLine)}>
            <primitive object={m0.object} rotation={monobraccioORotation} />

            <group position={translate_x_y(-m0.offset, m0.length)}>
                <primitive object={j5.object} rotation={j5Rotation} position={translate_x(-j5.fixedFlangeFromCentreLine)} />
            </group>
        </group>
    )
}

const Joint6Segment = ({ parts }: { parts: NamedLoadedRobotDefinition }) => {
    const { m0, j5, s0 } = parts

    return (
        <group position={translate_z(m0.length + j5.moveableFlangeFromCentreLine)}>
            {/* SEGMENT/LINK 6 */}
            <primitive object={s0.object} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    )
}

export const AwTubeRobot4 = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    const parts_unnamed = useLoadedRobotDefinition(definition)
    const parts = Object.fromEntries(
        // prettier-ignore
        ["b0", "j0", "c0", "j1", "f0", "l0", "f1", "j2", "c1", "j3", "f2", "l1", "f3", "j4", "m0", "j5", "s0"].map((name, index) => [name, parts_unnamed[index]])
    ) as NamedLoadedRobotDefinition

    // prettier-ignore
    return (
        <KinChainProvider kinematicsConfigurationIndex={0}>
            <group position={position} quaternion={quaternion} scale={1000}>
                <BaseSegment parts={parts} />
                <AwKinematicsGroup jointIndex={0} segment={<Joint1Segment parts={parts} />}>
                    <AwKinematicsGroup jointIndex={1} segment={<Joint2Segment parts={parts} />}>
                        <AwKinematicsGroup jointIndex={2} segment={<Joint3Segment parts={parts} />}>
                            <AwKinematicsGroup jointIndex={3} segment={<Joint4Segment parts={parts} />}>
                                <AwKinematicsGroup jointIndex={4} segment={<Joint5Segment parts={parts} />}>
                                    <AwKinematicsGroup jointIndex={5} segment={<Joint6Segment parts={parts} />}>
                                        <TriadHelper size={.3} />
                                        <Sphere scale={[0.02, 0.02, 0.02]}>
                                            <meshStandardMaterial color="red" />
                                        </Sphere>
                                    </AwKinematicsGroup>
                                </AwKinematicsGroup>
                            </AwKinematicsGroup>
                        </AwKinematicsGroup>
                    </AwKinematicsGroup>
                </AwKinematicsGroup>
            </group>
        </KinChainProvider>
    );
}
