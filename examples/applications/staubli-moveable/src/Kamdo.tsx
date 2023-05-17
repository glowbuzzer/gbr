/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"

export const Kamdo = ({ position }) => {
    const { nodes, materials } = useMemo(() => useGLTF("/assets/kamdo.glb"), []) as any

    return (
        <group scale={[250, 250, 250]} rotation={[Math.PI / 2, Math.PI, 0]} position={position}>
            <mesh
                castShadow={true}
                receiveShadow={true}
                geometry={nodes.body001.geometry}
                material={materials.Body}
            />
            <group>
                <mesh
                    castShadow={true}
                    receiveShadow={true}
                    geometry={nodes.head001.geometry}
                    material={materials.Head}
                />
                <mesh castShadow={true} receiveShadow={true} geometry={nodes.stripe001.geometry}>
                    <meshBasicMaterial toneMapped={false} />
                    {/*
                    <pointLight intensity={10} color={[0, 200, 5]} distance={0} />
*/}
                </mesh>
            </group>
        </group>
    )
}
