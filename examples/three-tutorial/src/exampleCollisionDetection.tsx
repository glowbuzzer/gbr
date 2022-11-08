import * as React from "react"
import {
    useRef,
    useState
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    PivotControls,
    Html
} from "@react-three/drei"
import {useFrame, useThree} from "@react-three/fiber"
import niceColors from "nice-color-palettes"

import {EffectComposer, Outline, SelectiveBloom, Bloom} from '@react-three/postprocessing'

export const ExampleCollisionDetection = () => {

    const sphereRef = useRef<THREE.Mesh>(null)

    const sphereRef2 = useRef<THREE.Mesh>(null)

    const [intersects, setIntersets] = useState(false);

    useFrame(() => {
        if (sphereRef && sphereRef.current) {
            sphereRef.current.geometry.computeBoundingBox()
            sphereRef2.current.geometry.computeBoundingBox()

            var box1 = sphereRef.current.geometry.boundingBox.clone()
            box1.applyMatrix4(sphereRef.current.matrixWorld)

            var box2 = sphereRef2.current.geometry.boundingBox.clone()
            box2.applyMatrix4(sphereRef2.current.matrixWorld)

            setIntersets(box1.intersectsBox(box2))
            console.log("interects", intersects )
        }
    })
    const [active1, setActive1] = useState(false);

    const [active2, setActive2] = useState(false);

    const { gl, scene, camera, size } = useThree()


    return (
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 8 - object collision detection - use the PivotControls to move the sphere until they collide</h1></Html>

            <PivotControls autoTransform={true} scale={300} anchor={[0,0,0]} visible={active1} activeAxes={[active1,active1,active1]}>
            <Sphere ref={sphereRef} args={[30]}
                    position={[0, 300, 0]}
                    onClick={() => setActive1(!active1)}
            >
                <meshStandardMaterial color={niceColors[17][1]}/>
            </Sphere>
                {intersects &&
                    <EffectComposer autoClear={false}>
                        <Outline selection={sphereRef} visibleEdgeColor={"black"} edgeStrength={50}
                                 edgeThickness={10}/>
                    </EffectComposer>
                }
            </PivotControls>
            <PivotControls autoTransform={true} scale={300} anchor={[0,0,0]} visible={active2} activeAxes={[active2,active2,active2]}>
            <Sphere ref={sphereRef2} args={[30]}
                    position={[0, 500, 0]}
                    onClick={() => setActive2(!active2)}
            >
                <meshStandardMaterial color={niceColors[17][2]}/>
            </Sphere>
            </PivotControls>
        </>
    )
}