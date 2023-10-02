/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Euler } from "three"
import { useCustomLinkLengths } from "./store"

type Axis = "X" | "Y" | "Z"
// simple function to create Euler for a single axis of rotation
function euler(position: number, axis: Axis) {
    return new Euler(
        axis === "X" ? position : 0,
        axis === "Y" ? position : 0,
        axis === "Z" ? position : 0
    )
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

    // get the link lengths from the app state - these are adjusted by the LinkLengthTile
    const [linkLengths] = useCustomLinkLengths()

    // load the joint and link (tube) model files
    const parts = useMemo(
        () =>
            useGLTF([
                ...[1, 2, 3, 4, 5, 6].map(j => `/assets/awtube-l/j${j}.glb`),
                "/assets/awtube-l/127tube.glb",
                "/assets/awtube-l/100tube.glb"
            ]).map(m => {
                // get the scene and scale it up by 1000
                const group = m.scene.clone()
                group.scale.set(1000, 1000, 1000)
                return group
            }),
        []
    )

    // convenience variables for the parts
    const [base, shoulder, elbow, wrist, hand, tool, tube127, tube100] = parts

    // create Euler rotations for each joint
    // (some are rotated in Z and some in Y)
    const axis_of_rotation: Axis[] = ["Z", "Y", "Y", "Z", "Y", "Z"]
    const [
        baseRotation,
        shoulderRotation,
        elbowRotation,
        wristRotation,
        handRotation,
        toolRotation
    ] = jointPositions.map((p, i) => euler(p, axis_of_rotation[i]))

    // get the translation from the frame, in order to position the robot
    const { x, y, z } = frame.translation

    // get the link lengths and calculate the scale for the tubes
    // (the tubes are 466 and 460mm respectively in the model files)
    const [l1, l2] = linkLengths
    const s1 = l1 / 466
    const s2 = l2 / 460

    // stack the parts together in nested groups to create the robot
    return (
        <group position={[x, y, z]} rotation={baseRotation}>
            <primitive object={base} rotation={[Math.PI / 2, 0, 0]} />

            <group position={[0, 245, 0]} rotation={shoulderRotation}>
                <primitive object={shoulder} rotation={[Math.PI / 2, 0, 0]} />
                <primitive
                    object={tube127}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[1000, s1 * 1000, 1000]}
                />

                <group position={[0, 0, l1]}>
                    <primitive object={elbow} rotation={[Math.PI / 2, 0, 0]} />

                    <group position={[0, -245, 0]} rotation={elbowRotation}>
                        <primitive
                            object={tube100}
                            rotation={[0, Math.PI / 2, 0]}
                            scale={[s2 * 1000, 1000, 1000]}
                        />
                        <primitive
                            object={wrist}
                            rotation={new Euler(Math.PI / 2, 0, Math.PI / 2)}
                        />

                        <group position={[0, 0, l2]} rotation={wristRotation}>
                            <primitive
                                object={hand}
                                rotation={new Euler(-Math.PI / 2, 0, -Math.PI / 2)}
                            />

                            <group position={[0, 0, 0]} rotation={handRotation}>
                                <primitive
                                    object={tool}
                                    //
                                    rotation={[-Math.PI / 2, 0, 0]}
                                />

                                <group position={[0, 0, 358]} rotation={toolRotation}>
                                    {children}
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
