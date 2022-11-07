import * as React from "react"
import {
    useRef,
    useState,
    useEffect,
    useCallback
} from "react"
import * as THREE from 'three'
import {
    Box,
    Sphere,
    Cylinder,
    useGLTF,
    useTexture,
    PivotControls,
    meshBounds,
    Shadow,
    Html
} from "@react-three/drei"
import {useFrame, useThree} from "@react-three/fiber"
// import {useSpring, a} from "@react-spring/web"
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'

import niceColors from "nice-color-palettes"

import {useConnection, useFrames, useKinematicsCartesianPosition} from "@glowbuzzer/store";


const Boxy = (props) => {
    const [active, setActive] = useState(0);
    // create a common spring that will be used later to interpolate other values
    const { spring } = useSpring({
        spring: active,
        config: { mass: 5, tension: 400, friction: 50, precision: 0.0001 },
    });
    // interpolate values from commong spring
    const scale = spring.to([0, 1], [1, 5]);
    const rotation = spring.to([0, 1], [0, Math.PI]);
    const color = spring.to([0, 1], ["#6246ea", "#e45858"]);
    return (
        // using a from react-spring will animate our component
        <a.mesh
            rotation-y={rotation}
            scale-x={scale}
            scale-z={scale}
            onClick={() => setActive(Number(!active))}
        >
            <boxBufferGeometry attach="geometry" args={[100, 100, 100]} />
            <a.meshStandardMaterial roughness={0.5} attach="material" color={color} />
        </a.mesh>
    );
}

function Switch({ x, set }) {
    const { nodes, materials } = useGLTF("/models/switch.glb")
    const texture = useTexture("/textures/cross.jpg")
    // Hover state
    const [hovered, setHover] = useState(false)
    useEffect(() => void (document.body.style.cursor = hovered ? "pointer" : "auto"), [hovered])
    // Events
    const onClick = useCallback(() => set((toggle) => Number(!toggle)), [set])
    const onPointerOver = useCallback(() => setHover(true), [])
    const onPointerOut = useCallback(() => setHover(false), [])
    // Interpolations
    const pZ = x.to([0, 1], [-1.20, 1.20])
    // const rX = x.to([0, 1], [0, Math.PI * 1.3])

    const rX = 0
    const color = x.to([0, 1], ["#888", "#2a2a2a"])

    return (
        <group scale={[100, 100, 100]} rotation={[Math.PI/2,0,0]} position={[0,700,0]} dispose={null}>
            <a.mesh receiveShadow castShadow material={materials.track} geometry={nodes.Cube.geometry} material-color={color} material-roughness={0.5} material-metalness={0.8} />
            <a.group position-y={0.45} position-z={pZ}>
                <a.mesh receiveShadow castShadow raycast={meshBounds} rotation-x={rX} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
                    {/*<sphereGeometry args={[0.8, 64, 64]} />*/}
                    <cylinderGeometry args={[0.7, 0.7, 0.8, 64]} />
                    <a.meshStandardMaterial roughness={0.5} map={texture} />
                </a.mesh>
                <a.pointLight intensity={100} distance={1.4} color={color} />
                <Shadow renderOrder={-1000} position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={1.5} />
            </a.group>
        </group>
    )
}

export const ExampleSpring = () => {
    const [toggle, set] = useState(0)
    const [{ x }] = useSpring({ x: toggle, config: { mass: 5, tension: 300, friction: 50, precision: 0.0001 } }, [toggle])

    return(
        <>
            <Html style={{
                width: "500px",
            }}
                  position={[-1000,1000,0]}>
                <h1>Example 14 - using springs to create interactive controls</h1></Html>

            <Switch x={x} set={set} />
            </>
            )
}
