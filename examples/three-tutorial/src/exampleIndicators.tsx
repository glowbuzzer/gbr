import * as React from "react"
import {
    useRef,
    Fragment,
    useState
} from "react"
import * as THREE from 'three'
import {
    Sphere,
    Html,
    Text,
    Instance,
    Instances,
    useGLTF
} from "@react-three/drei"
import {useFrame, useLoader} from "@react-three/fiber"
import {useDigitalOutputState, useKinematicsCartesianPosition} from "@glowbuzzer/store";

import {EffectComposer, Outline, SelectiveBloom, Bloom} from '@react-three/postprocessing'


function GlowBox({onHover, args, ...props}) {
    const ref = useRef()
    // useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))
    return (
        <mesh ref={ref} {...props} onPointerOver={(e) => onHover(ref)} onPointerOut={(e) => onHover(null)}>
            <sphereGeometry args={args}/>
            <meshStandardMaterial color={props.ledColor}/>
        </mesh>
    )
}


// function Model() {
//     const gltf = useGLTF("/models/led.glb")
//     return (<primitive object={gltf.scene} position={[500,500,0]} scale={[10,10,10]} />)
// }

export function LedModel(props) {
    const material = new THREE.MeshPhysicalMaterial({
    });

    const { nodes, materials } = useGLTF('/models/led.glb')
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.Mesh.geometry} material={materials.Material}>
                <meshPhysicalMaterial roughness={0}
                transmission={1}
                thickness={0.2}
                />
            </mesh>
        </group>
    )
}

export function BezelModel(props) {
    const { nodes, materials } = useGLTF('/models/bezel.glb')
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes['5mm_led_bezel_v1'].geometry} material={materials.A39A86} >
                <meshStandardMaterial
                    metalness={1}   // between 0 and 1
                    roughness={0.5} // between 0 and 1
                />
            </mesh>
        </group>
    )
}


function Led() {
    const sphereRef = useRef();
    const matRef = useRef();
    const repeatX = 10;
    const repeatY = 10;


    // const base = useLoader(THREE.TextureLoader, "maps/led_emmisive.png")
    // base.wrapS = THREE.RepeatWrapping;
    // base.wrapT = THREE.RepeatWrapping;
    // base.repeat.set(repeatX, repeatY);

    const [hovered, onHover] = useState(null)
    const selected = hovered ? [hovered] : undefined

    const ledColor = selected ? "red" : "pink"

    const lightRef = useRef()
    const lightRef2 = useRef()
    const lightRef3 = useRef()

    // useFrame(({ clock }) => {
    //   sphereRef.current.rotation.y += -0.01;
    //   matRef.current.emissiveIntensity = Math.abs(
    //     Math.sin(clock.elapsedTime * 0.5)
    //   );
    // });

    return (
        <>
            <ambientLight intensity={0.5} ref={lightRef} />
            <GlowBox onHover={onHover} ledColor={ledColor} args={[50, 32, 32, 0, 2*Math.PI, 0, Math.PI/2]} rotation={[Math.PI/2,0,0]} position={[500, 500, 0]} />
            {/*<mesh ref={sphereRef} position={[500, 500, 250]} onPointerOver={(e) => onHover(ref)}><sphereGeometry args={[50, 36, 36]}/>      <meshStandardMaterial color="red" /></mesh>*/}
            {/*<EffectComposer autoClear={false}>*/}
            {/*<SelectiveBloom selection={selected} intensity={4.0} luminanceThreshold={0.01} luminanceSmoothing={0.025} lights={[lightRef]}/>*/}
            {/*<Bloom intensity={4.0} luminanceThreshold={0.01} luminanceSmoothing={0.025}/>*/}
            {/*</EffectComposer>*/}
        </>
    )
}


export const ExampleIndicators = () => {

    const [hovered, onHover] = useState(null)
    const selected = hovered ? [hovered] : undefined
    const lightRef = useRef()
    const lightRef2 = useRef()
    const lightRef3 = useRef()
    useDigitalOutputState
    const digitalOutValue = useDigitalOutputState(0)[0].effectiveValue
    // console.log(digitalOutValue)

    return (
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 13 - adding indicators to your canvas - override digital outputs #0 and #1 to see the effect</h1></Html>
            <Led/>
            <LedModel position={[500,500,0]} scale={[10,10,10]}/>
            <BezelModel position={[300,500,0]} scale={[10,10,10]}/>

        </>
    )

}
