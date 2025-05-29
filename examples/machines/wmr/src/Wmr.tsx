import { useJointPositions, useKinematicsCartesianPosition } from "@glowbuzzer/store"
import { useGLTF } from "@react-three/drei"
import React, { useEffect, useMemo, useRef } from "react"

export const Wmr = () => {
    const jointPositions = useJointPositions(0)
    const cartesianPosition = useKinematicsCartesianPosition(0)

    // load the parts of the robot (links)
    const parts = useMemo(
        () => useGLTF([0, 1, 2].map(j => `/assets/bot/L${j}.glb`)).map(m => m.scene),
        []
    )

    useEffect(() => {
        if (baseRef.current && leftWheeelRef.current && rightWheelRef) {
            baseRef.current.position.x = cartesianPosition.position.translation.x / 1000
            baseRef.current.position.y = cartesianPosition.position.translation.y / 1000

            baseRef.current.quaternion.set(
                cartesianPosition.position.rotation.x,
                cartesianPosition.position.rotation.y,
                cartesianPosition.position.rotation.z,
                cartesianPosition.position.rotation.w
            )
            console.log(jointPositions[0])
            console.log(cartesianPosition.position.translation.x)
            leftWheeelRef.current.rotation.y = jointPositions[0] || 0
            rightWheelRef.current.rotation.y = jointPositions[1] || 0
        }
    }, [jointPositions])

    const sceneRef = useRef(null)
    const baseRef = useRef(null)
    const leftWheeelRef = useRef(null)
    const rightWheelRef = useRef(null)

    return (
        <group rotation={[Math.PI, 0, 0]} ref={sceneRef} scale={[1000, 1000, 1000]}>
            <group ref={baseRef}>
                <primitive rotation={[0, 0, 0]} object={parts[0]} position={[0, 0, 0]} />
                <group position={[0, -0.07735, -0.03045]}>
                    <primitive
                        ref={leftWheeelRef}
                        rotation={[0, 0, Math.PI / 2]}
                        object={parts[1]}
                    />
                </group>
                <group position={[0, 0.07735, -0.03045]}>
                    <primitive
                        ref={rightWheelRef}
                        rotation={[0, 0, -Math.PI / 2]}
                        object={parts[2]}
                    />
                </group>
            </group>
        </group>
    )
}
