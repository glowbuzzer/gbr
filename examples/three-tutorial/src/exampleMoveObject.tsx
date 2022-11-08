import * as React from "react"
import {
    useRef,
    useState
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    PivotControls,
    TransformControls,
    Html
} from "@react-three/drei"
import {useFrame} from "@react-three/fiber"
import niceColors from "nice-color-palettes"

export const ExampleMoveObject = () => {

    const sphereRef = useRef<THREE.Mesh>(null)
    const [active, setActive] = useState(false);


    return (
        <>
                <Html style={{
                    width: "500px",
                }}
                      position={[-1000,1000,0]}>
                    <h1>Example 7 - move an object within the scene with PivotControls</h1></Html>

                <PivotControls autoTransform={true} scale={300} anchor={[0,0,0]} visible={active}>
            <Sphere ref={sphereRef} args={[50]}
                    position={[0, 300, 0]}
                    onClick={() => setActive(!active)}
            >
                <meshStandardMaterial color={niceColors[17][3]}/>
            </Sphere>
            </PivotControls>
            {/*<TransformControls mode={"translate"} scale={300} object={sphereRef} />*/}
        </>
    )
}