import { Tile } from "@glowbuzzer/layout"
import React, { useRef, useState } from "react"
import { Canvas, extend, MeshProps, useFrame, useThree } from "react-three-fiber"
import { Mesh } from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { TestRendering } from "./TestRendering"
import { usePreview } from "@glowbuzzer/store"

// extend({ OrbitControls })

const CameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
        camera,
        gl: { domElement }
    } = useThree()
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef(null)
    useFrame(state => controls.current.update())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <orbitControls ref={controls} args={[camera, domElement]} />
}

function Box(props: MeshProps) {
    // This reference will give us direct access to the mesh
    const mesh = useRef<Mesh>()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    })

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={_event => setActive(!active)}
            onPointerOver={event => setHover(true)}
            onPointerOut={event => setHover(false)}
        >
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? "blue" : "orange"} />
        </mesh>
    )
}

export const TestTile = () => {
    const { segments } = usePreview()

    return (
        <Tile title="react-three-fibre">
            <Canvas>
                {/*
                <TestRendering />
*/}
            </Canvas>
            {/*<CameraControls />*/}
            {/*<ambientLight />*/}
            {/*<pointLight position={[10, 10, 10]} />*/}
            {/*<Box position={[-1.2, 0, 0]} />*/}
            {/*<Box position={[1.2, 0, 0]} />*/}
        </Tile>
    )
}
