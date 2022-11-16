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
    Html,
    useDepthBuffer,
    SpotLight
} from "@react-three/drei"
import {useThree, useFrame, Canvas} from "@react-three/fiber"


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



// function MovingSpot({ vec = new THREE.Vector3(), ...props }) {
//     const light = useRef()
//     const viewport = useThree((state) => state.viewport)
//     useFrame((state) => {
//         if (light.current) {
//
//             light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
//             light.current.target.updateMatrixWorld()
//         }
//     })
//     return <SpotLight castShadow ref={light}  {...props} />
//
// }

const TrackingSpotlight = forwardRef<THREE.Mesh, any>((props, ref) => {

    const spotRef = useRef(null)
    // useHelper(spotRef, THREE.SpotLightHelper, "cyan")

    useEffect(() => {
        if (ref && typeof ref != "function") {
            spotRef.current.target = ref.current
            console.log('ref: ', ref)
        }
    }, [ref])


    const depthBuffer = useDepthBuffer({ frames: 1 })

    return (
            <SpotLight position={[200, 200, 300]} castShadow ref={spotRef} attenuation={800} anglePower={4} radiusTop={20} radiusBottom={200} distance={2000} intensity={20} depthBuffer={depthBuffer} color="#0c8cbf"  />
    )
})

