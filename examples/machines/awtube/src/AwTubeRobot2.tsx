/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useFrame, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Euler, Group, Quaternion, Vector3 } from "three"
import { KinChainProvider } from "../../../util/kinematics/KinChainProvider"
import React from "react"
import { Sphere, useGLTF } from "@react-three/drei"
import { KinematicsGroup } from "../../../util/kinematics/KinematicsGroup"
import { TriadHelper } from "@glowbuzzer/controls"
import { LayoutObjectGrid } from "../../../util/LayoutObjectGrid"

type PartDefinition = {
    type: "bases" | "joints" | "links" | "flanges" | "clamps" | "monobraccios" | "spindles"
    filename: string
    positions?: [incoming?: Vector3, outgoing?: Vector3]
    rotations?: [incoming?: Euler, outgoing?: Euler]
}

const parts_list: Record<string, PartDefinition> = {
    MM219: {
        type: "bases",
        filename: "base_219.glb",
        rotations: [new Euler(Math.PI / 2, 0, 0)]
        // positions: [new Vector3(0, 0, -0.025)]
    },
    J20_INVERTED: {
        type: "joints",
        filename: "joint_j20.glb",
        rotations: [
            new Euler(Math.PI / 2, Math.PI / 2, -Math.PI / 2),
            new Euler(Math.PI / 2, Math.PI / 2, 0)
        ],
        positions: [new Vector3(0, 0, 0.066), new Vector3(0, 0.073, 0.066)]
    },
    J25: {
        type: "joints",
        filename: "joint_j25.glb",
        rotations: [new Euler(-Math.PI / 2, -Math.PI / 2, 0), new Euler(-Math.PI / 2, 0, 0)],
        positions: [new Vector3(0, 0, 0.092), new Vector3(0, 0.1045, 0.092)]
    },
    J25_INVERTED: {
        type: "joints",
        filename: "joint_j25.glb",
        rotations: [
            new Euler(Math.PI / 2, 0, -Math.PI / 2),
            new Euler(Math.PI / 2, Math.PI / 2, 0)
        ],
        positions: [new Vector3(0, 0, 0.0915), new Vector3(0.0874, 0, 0.0915)]
    },
    J32: {
        type: "joints",
        filename: "joint_j32.glb",
        rotations: [new Euler(-Math.PI / 2, -Math.PI / 2, 0), new Euler(-Math.PI / 2, 0, 0)],
        positions: [new Vector3(0, 0, 0.092), new Vector3(0, 0.1045, 0.092)]
    },
    J32_INVERTED: {
        type: "joints",
        filename: "joint_j32.glb",
        rotations: [
            new Euler(Math.PI / 2, 0, -Math.PI / 2),
            new Euler(Math.PI / 2, Math.PI / 2, 0)
        ],
        positions: [new Vector3(0, 0, 0.1045), new Vector3(0.092, 0, 0.1045)]
    },
    LINK_MM127_302: {
        type: "links",
        filename: "link_127_302.glb",
        rotations: [new Euler(-Math.PI / 2, 0, 0), new Euler(0, 0, Math.PI / 2)],
        positions: [null, new Vector3(0, 0, 0.3)]
    },
    LINK_MM100_283: {
        type: "links",
        filename: "link_100_283.glb",
        rotations: [new Euler(-Math.PI / 2, 0, 0), new Euler(0, 0, -Math.PI / 2)],
        positions: [null, new Vector3(0, 0, 0.2831)]
    },
    FLANGE_J32: {
        type: "flanges",
        filename: "flange_j32.glb",
        rotations: [new Euler(-Math.PI / 2, 0, 0)],
        positions: [null, new Vector3(0, 0, 0.007)]
    },
    FLANGE_J32_INVERTED: {
        type: "flanges",
        filename: "flange_j32.glb",
        rotations: [new Euler(Math.PI / 2, 0, 0)],
        positions: [new Vector3(0, 0, 0.007), new Vector3(0, 0, 0.007)]
    },
    FLANGE_J25: {
        type: "flanges",
        filename: "flange_j25.glb",
        rotations: [new Euler(-Math.PI / 2, 0, 0)],
        positions: [new Vector3(0, 0, 0), new Vector3(0, 0, 0.0105)]
    },
    FLANGE_J25_INVERTED: {
        type: "flanges",
        filename: "flange_j25.glb",
        rotations: [new Euler(Math.PI / 2, 0, 0)],
        positions: [new Vector3(0, 0, 0.0105), new Vector3(0, 0, 0.0105)]
    },
    CLAMP_J32_J32: {
        type: "clamps",
        filename: "clamp_j32_j32.glb",
        rotations: [new Euler(-Math.PI / 2, 0, 0)],
        positions: [null, new Vector3(0, 0, 0.0505)]
    },
    CLAMP_J32_J25: {
        type: "clamps",
        filename: "clamp_j32_j25.glb",
        rotations: [new Euler(Math.PI / 2, 0, 0)],
        positions: [null, new Vector3(0, 0, 0.0635)]
    },
    MONOBRACCIOS_MM220: {
        type: "monobraccios",
        filename: "monob_220.glb",
        rotations: [
            new Euler(Math.PI / 2, -Math.PI / 2, -Math.PI / 2),
            new Euler(Math.PI / 2, 0, 0)
        ],
        positions: [null, new Vector3(0, -0.025, 0.22)]
    },
    SPINDLE_M112: {
        type: "spindles",
        filename: "spindle_112.glb",
        rotations: [new Euler(Math.PI / 2, 0, 0)]
    }
}

type SegmentComponent = {
    partName: keyof typeof parts_list
    reversed?: boolean
}

function two_tuple<T>(arr?: T[]) {
    return Array.from({ length: 2 }).map((_, i) => arr?.[i] || null)
}

function assemble(position: Vector3, rotation: Euler, ...parts: SegmentComponent[]) {
    const models = useGLTF(
        parts.map(
            ({ partName }) =>
                `/assets/aw/awtube/${parts_list[partName].type}/${parts_list[partName].filename}`
        )
    )

    const root = new Group()
    root.position.copy(position)
    root.setRotationFromEuler(rotation)

    parts.reduce((parent, { partName, reversed }, index) => {
        const { positions, rotations } = parts_list[partName]

        const [position, offsetPosition] = two_tuple(positions).map(p =>
            p ? p.clone() : new Vector3()
        )
        const [rotation, offsetRotation] = two_tuple(rotations).map(r =>
            r ? new Quaternion().setFromEuler(r) : new Quaternion()
        )

        const part = models[index].scene.clone()
        part.position.copy(position)
        part.quaternion.copy(rotation)
        parent.add(part)
        const group = new Group()
        parent.add(group)
        group.position.copy(offsetPosition)
        group.quaternion.copy(offsetRotation)
        if (index === parts.length - 1) {
            // group.add(new AxesHelper(1))
        }
        return group
    }, root)

    return root
}

const Item = ({ partName }) => {
    const group = useGLTF(
        `/assets/aw/awtube/${parts_list[partName].type}/${parts_list[partName].filename}`
    ).scene.clone()
    return (
        <group>
            <TriadHelper size={0.2} />
            <primitive object={group} />
        </group>
    )
}

const LayoutAllParts = () => {
    return (
        <group position={[-1800, -1300, 100]} scale={1000}>
            {Object.keys(parts_list).map((partName, index) => {
                const col = index % 3
                const row = Math.floor(index / 3)
                return (
                    <group key={index} position={[col * 0.4, row * 0.6, 0]}>
                        <Item partName={partName} />
                    </group>
                )
            })}
        </group>
    )
}

export const AwTubeRobot2 = ({ children = null }) => {
    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    const position = new Vector3().copy(translation as any)
    const quaternion = new Quaternion().copy(rotation as any)

    // the origin is the axis of the first joint, so we need to offset the base by joint's Y offset plus base's height
    const base = assemble(new Vector3(0, 0, -0.092 - 0.025), new Euler(), { partName: "MM219" })
    // again, origin is the axis of the joint, so offset by the joint's Y offset to the face
    const p0 = assemble(new Vector3(0, 0, -0.092), new Euler(), { partName: "J32" })
    const p1 = assemble(
        new Vector3(0, 0, 0.1045),
        new Euler(0, 0, -Math.PI / 2),
        { partName: "CLAMP_J32_J32" },
        { partName: "J32" },
        { partName: "FLANGE_J32" },
        { partName: "LINK_MM127_302" },
        { partName: "FLANGE_J32_INVERTED" },
        { partName: "J32_INVERTED" },
        { partName: "CLAMP_J32_J25" }
    )
    const p2 = assemble(new Vector3(0, 0, 0.0915), new Euler(Math.PI, 0, Math.PI / 2), {
        partName: "J25_INVERTED"
    })
    const p3 = assemble(
        new Vector3(0, 0, 0.0874),
        new Euler(0, 0, Math.PI),
        { partName: "FLANGE_J25" },
        { partName: "LINK_MM100_283" },
        { partName: "FLANGE_J25_INVERTED" },
        { partName: "J25_INVERTED" }
    )
    const p4 = assemble(
        new Vector3(0, 0, 0.0915),
        new Euler(Math.PI / 2),
        { partName: "MONOBRACCIOS_MM220" },
        { partName: "J20_INVERTED" }
    )
    const p5 = assemble(new Vector3(0, 0, 0.328 - 0.045), new Euler(), {
        partName: "SPINDLE_M112"
    })

    return (
        <KinChainProvider kinematicsConfigurationIndex={0}>
            {/*
            <LayoutAllParts />
*/}
            <LayoutObjectGrid objects={[base, p0, p1, p2, p3, p4, p5]} />

            <group position={position} quaternion={quaternion} scale={1000}>
                <primitive object={base} />
                <KinematicsGroup jointIndex={0} part={p0}>
                    <KinematicsGroup jointIndex={1} part={p1}>
                        <KinematicsGroup jointIndex={2} part={p2}>
                            <KinematicsGroup jointIndex={3} part={p3}>
                                <KinematicsGroup jointIndex={4} part={p4}>
                                    <KinematicsGroup jointIndex={5} part={p5}>
                                        <TriadHelper size={1} />
                                        <Sphere scale={[0.02, 0.02, 0.02]}>
                                            <meshStandardMaterial color="red" />
                                        </Sphere>
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
