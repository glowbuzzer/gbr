import * as React from "react"
import {
    useRef,
    forwardRef,
    useEffect
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    useHelper,
    Html
} from "@react-three/drei"
import {useThree} from "@react-three/fiber"
import {useFrames, useKinematicsCartesianPosition} from "@glowbuzzer/store";


export const ExampleSpotlightOnObject = () => {

    const sphereRef = useRef<THREE.Mesh>(null)

    return (
        <>
                <Html style={{
                    width: "500px",
                }}
                      position={[-1000,1000,0]}>
                    <h1>Example 3 - illuminating objects with a spotlight</h1></Html>

                <Sphere ref={sphereRef} args={[20]}
                    position={[600, 300, 0]}
            >
                <meshStandardMaterial color="red"/>
            </Sphere>

            <TrackingSpotlight ref={sphereRef}/>
        </>
    )
}

const TrackingSpotlight = forwardRef<THREE.Mesh, any>((props, ref) => {

    const spotRef = useRef(null)
    const pointRef1 = useRef()
    // const {scene} = useThree()
    useHelper(spotRef, THREE.SpotLightHelper, "cyan")
    useHelper(pointRef1, THREE.PointLightHelper, 100, "magenta")


    useEffect(() => {
        if (ref) {
            spotRef.current.target = ref.current
            console.log('ref: ', ref)
        }
    }, [ref])

    return (
        <>
            <spotLight
                ref={spotRef}
                angle={12 * Math.PI / 180}
                position={[0, 0, 1000]}
                color={"red"}
                castShadow
            />
        </>
    )
})


{/*<pointLight*/}
{/*    position={[0, 0, 200]}*/}
{/*    intensity={1}*/}
{/*    castShadow={true}*/}
{/*    shadow-mapSize-height={1024}*/}
{/*    shadow-mapSize-width={1024}*/}
{/*    shadow-radius={20}*/}
{/*    shadow-bias={-0.0001}*/}
{/*/>*/}


{/*<pointLight*/}
{/*    ref={pointRef1}*/}
{/*    position={[300, 0, 0]}*/}
{/*    intensity={0.5}*/}
{/*    castShadow*/}
{/*    shadow-mapSize-height={512}*/}
{/*    shadow-mapSize-width={512}*/}
{/*    shadow-radius={10}*/}
{/*    shadow-bias={-0.0001}*/}
{/*/>*/}
{/*<pointLight*/}
{/*    position={[150, 150, 150]}*/}
{/*    intensity={0.5}*/}
{/*    castShadow={true}*/}
{/*    shadow-mapSize-height={512}*/}
{/*    shadow-mapSize-width={512}*/}
{/*    shadow-radius={10}*/}
{/*    shadow-bias={-0.0001}*/}
{/*/>*/}

