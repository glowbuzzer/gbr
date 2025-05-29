import {
    useJointPositions,
    useKinematicsCartesianPosition,
    useKinematicsConfiguration
} from "@glowbuzzer/store"
import React, { useMemo } from "react"
import { TriadHelper } from "@glowbuzzer/controls"
import { VirtualWheel } from "./VirtualWheel"
import { AGV_KC_INDEX } from "../constants"
import { Box, useGLTF } from "@react-three/drei"

export const AgvModel = ({ children }) => {
    const { position } = useKinematicsCartesianPosition(AGV_KC_INDEX)
    const { agvWheels: wheels } = useKinematicsConfiguration(AGV_KC_INDEX)
    const joints = useJointPositions(AGV_KC_INDEX)

    const [base] = useMemo(
        () =>
            // @ts-ignore
            useGLTF([`${import.meta.env.BASE_URL}assets/agv/simple_base.glb`]).map(m => {
                m.scene.traverse((node: any) => {
                    if (node.isMesh) {
                        node.material.transparent = true
                        node.material.opacity = 0.3
                    }
                })
                return m.scene.clone()
            }),
        []
    )

    const { translation, rotation } = position
    const { x, y } = translation

    return (
        <group scale={100}>
            <group position={[x, y, 0]} quaternion={rotation}>
                {wheels?.map((wheel, i) => (
                    <group key={i} position={[wheel.position.x, wheel.position.y, wheel.radius]}>
                        <group>
                            <group rotation={[0, 0, joints[i]]}>
                                <TriadHelper size={2} include={[0, 1]} />
                                <group rotation={[0, joints[i + 4], 0]}>
                                    <VirtualWheel key={i} radius={wheel.radius} />
                                </group>
                            </group>
                        </group>
                    </group>
                ))}
                <group position={[0, 0, 1.5]}>
                    <group position={[0, 0, 0.25]}>
                        <TriadHelper size={5} include={[0, 1]} />
                    </group>
                    {/*
                    <Box args={[6, 6, 0.5]}>
                        <meshBasicMaterial color="red" transparent opacity={0.2} />
                    </Box>
*/}
                </group>
                <group position={[0, 0, 1]}>
                    <primitive object={base} scale={10} />
                    <group scale={0.01}>
                        <group position={[0, 0, 117 + 175 + 120]}>{children}</group>
                    </group>
                </group>
            </group>
        </group>
    )
}
