import * as React from "react"
import {
    useRef,
    useState
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    Html
} from "@react-three/drei"
import {useFrame} from "@react-three/fiber"
import niceColors from "nice-color-palettes"


export const ExampleShowObjectCoordinates = () => {

    const sphereRef = useRef<THREE.Mesh>(null)
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
                <Html style={{
                    width: "500px",
                }}
                      position={[-1000,1000,0]}>
                    <h1>Example 6 - hover over the sphere to see the co-ordinates</h1></Html>

                <Sphere ref={sphereRef} args={[20]}
                    position={[0, 300, 0]}
                    onPointerOver={() => setIsHovered(true)}
                    onPointerOut={() => setIsHovered(false)}
            >
                <meshStandardMaterial color={niceColors[17][0]}/>
            </Sphere>
            {isHovered &&
                <Html position={[sphereRef.current.position.x,sphereRef.current.position.y,sphereRef.current.position.z]}>({sphereRef.current.position.x},{sphereRef.current.position.y},{sphereRef.current.position.z})</Html>
            }
        </>
    )
}