import * as React from "react"
import { useRef, Fragment, useState } from "react"
import * as THREE from "three"
import { Sphere, Html, Text, Instance, Instances, useGLTF } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { useDigitalOutputState, useKinematicsCartesianPosition } from "@glowbuzzer/store"

import { EffectComposer, Outline, SelectiveBloom, Bloom } from "@react-three/postprocessing"

function GlowBox({ onHover, args, ...props }) {
    const ref = useRef()
    // useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))
    return (
        <mesh
            ref={ref}
            {...props}
            onPointerOver={e => onHover(ref)}
            onPointerOut={e => onHover(null)}
        >
            <sphereGeometry args={args} />
            <meshStandardMaterial color={props.ledColor} />
        </mesh>
    )
}

export function LedModel(props) {
    const material = new THREE.MeshPhysicalMaterial({})

    const { nodes, materials } = useGLTF("/models/led.glb")

    const ledMesh = nodes.mesh as THREE.Mesh

    return (
        <group {...props} dispose={null}>
            <mesh geometry={ledMesh.geometry} material={materials.Material}>
                <meshPhysicalMaterial roughness={0} transmission={1} thickness={0.2} />
            </mesh>
        </group>
    )
}

export function BezelModel(props) {
    const { nodes, materials } = useGLTF("/models/bezel.glb")
    const bezel = nodes["5mm_led_bezel_v1"] as THREE.Mesh

    return (
        <group {...props} dispose={null}>
            <mesh geometry={bezel.geometry} material={materials.A39A86}>
                <meshStandardMaterial
                    metalness={1} // between 0 and 1
                    roughness={0.5} // between 0 and 1
                />
            </mesh>
        </group>
    )
}

function Led(props) {
    const [hovered, onHover] = useState(null)
    const selected = hovered ? [hovered] : undefined

    const ledColor = selected ? props.colorActive : props.colorInactive

    const lightRef = useRef()
    const lightRef2 = useRef()
    const lightRef3 = useRef()

    const ref = useRef()

    return (
        <>
            <mesh
                ref={ref}
                position={[props.position[0], props.position[1], props.position[2] + 12]}
                onPointerOver={e => onHover(ref)}
                onPointerOut={e => onHover(null)}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <sphereGeometry args={[30, 32, 32, 0, 2 * Math.PI, 0, Math.PI / 2]} />
                <meshStandardMaterial color={ledColor} />
            </mesh>

            {/*<GlowBox onHover={onHover} ledColor={ledColor} args={[30, 32, 32, 0, 2*Math.PI, 0, Math.PI/2]} rotation={[Math.PI/2,0,0]} position={[props.position[0],props.position[1],props.position[2]+12 ]} />*/}
        </>
    )
}

const Indicator = props => {
    console.log(props.position)
    return (
        <>
            <Led
                colorActive={props.colorActive}
                colorInactive={props.colorInactive}
                position={props.position}
            />
            <BezelModel
                position={[props.position[0], props.position[1], props.position[2] - 100]}
                scale={[10, 10, 10]}
            />
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
            <Html
                style={{
                    width: "500px"
                }}
                position={[-1000, 1000, 0]}
            >
                <h1>
                    Example 13 - adding indicators to your canvas - override digital outputs #0 and
                    #1 to see the effect
                </h1>
            </Html>

            {/*<LedModel position={[300,500,0]} scale={[10,10,10]}/>*/}

            <Indicator
                position={[100, 500, 0]}
                colorActive={"green"}
                colorInactive={"lightgreen"}
            />
            <Indicator position={[300, 500, 0]} colorActive={"red"} colorInactive={"pink"} />
            <Indicator
                position={[500, 500, 0]}
                colorActive={"gold"}
                colorInactive={"lemonchiffon"}
            />
        </>
    )
}
