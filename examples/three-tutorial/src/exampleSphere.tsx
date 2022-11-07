import * as React from "react"
import {
    useRef,
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    Html
} from "@react-three/drei"
import {useFrame} from "@react-three/fiber"
import niceColors from "nice-color-palettes"

export const ExampleSphere = () => {

    const sphereRef = useRef<THREE.Mesh>(null)

    const sphereRef2 = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (sphereRef && sphereRef.current) {
            sphereRef.current.geometry.computeBoundingBox()
            sphereRef2.current.geometry.computeBoundingBox()

            var box1 = sphereRef.current.geometry.boundingBox.clone()
            box1.applyMatrix4(sphereRef.current.matrixWorld)

            var box2 = sphereRef2.current.geometry.boundingBox.clone()
            box2.applyMatrix4(sphereRef2.current.matrixWorld)

            console.log("interects", box1.intersectsBox(box2))
        }
    })

    return (
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 1 - adding a sphere to the canvas</h1></Html>
            <Sphere ref={sphereRef} args={[20]}
                    position={[0, 300, 0]}
            >
                <meshStandardMaterial color="red"/>
            </Sphere>
            <Sphere ref={sphereRef2} args={[20]}
                    position={[0, 300, 0]}
            >
                <meshStandardMaterial color={niceColors[17][1]}/>
            </Sphere>
        </>
    )
}