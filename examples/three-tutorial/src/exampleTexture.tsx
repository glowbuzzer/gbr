import * as React from "react"
import {
    useRef,
} from "react"
import * as THREE from 'three'
import {
    Box,
    Sphere,
    useTexture,
    Html
} from "@react-three/drei"
import {useFrame} from "@react-three/fiber"
import {ActiveExampleContext} from "./activeExampleContext";

export const ExampleTexture = () => {

        const boxRef = useRef(null)

        const props = useTexture({
            metalnessMap: "/textures/Metal024/Metal024_1K_Metalness.jpg",
            map: "/textures/Metal024/Metal024_1K_Color.jpg",
            roughnessMap: "/textures/Metal024/Metal024_1K_Roughness.jpg",
            normalMap: "/textures/Metal024/Metal024_1K_NormalGL.jpg"
        })

        useFrame(({clock}) => {
            boxRef.current.rotation.x = (Math.sin(clock.elapsedTime) * Math.PI) / 4
            boxRef.current.rotation.y = (Math.sin(clock.elapsedTime) * Math.PI) / 4
            boxRef.current.rotation.z = (Math.sin(clock.elapsedTime) * Math.PI) / 4
            boxRef.current.position.x = 400
            boxRef.current.position.y = Math.sin(clock.elapsedTime) * 300
            boxRef.current.position.z = Math.sin(clock.elapsedTime) + 200
        })


    return (
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 2 - adding texture to objects and moving them</h1></Html>

            <Box ref={boxRef} args={[200,200,200]} position={[0, 300, 0]}  castShadow={true}>
        <meshStandardMaterial {...props}/>
        </Box>
            </>
    )
}