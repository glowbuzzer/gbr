import ReactDOM from "react-dom"
import React, { StrictMode, useRef, useState } from "react"
import {
    CartesianDro,
    ConnectTile,
    GlowbuzzerApp,
    JogTile,
    JointDroTile,
    PreferencesDialog,
    ToolPathTile
} from "@glowbuzzer/controls"

import { Button } from "antd"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import styled from "styled-components"
import { Canvas, useFrame, useThree } from "react-three-fiber"
import { useHelper } from "@react-three/drei"
import { PointLightHelper } from "three"
import { CameraControls } from "../../../libs/controls/src/toolpath/ToolPathAutoSize"

const StyledApp = styled.div`
    padding: 20px;
    display: flex;
    width: 100%;
    gap: 20px;

    nav {
        min-width: 300px;
    }

    nav,
    section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    section {
        flex-grow: 1;
        min-height: 1200px;
        //max-width: 1200px;
    }
`

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

function Scene() {
    const { scene } = useThree()
    const group = useRef()
    const mesh = useRef()
    const spotLight = useRef()
    const pointLight = useRef()

    useFrame(({ clock }) => {
        const x = mesh.current as any
        x.rotation.x = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        x.rotation.y = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        x.rotation.z = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        x.position.x = Math.sin(clock.elapsedTime)
        x.position.z = Math.sin(clock.elapsedTime)
        // ;(group.current as any).rotation.y += 0.02
    })

    // useEffect(() => void ((spotLight.current as any).target = mesh.current), [scene])
    // useHelper(mesh, BoxHelper, "#272740")
    // useHelper(mesh, VertexNormalsHelper, 1, "#272740")
    // useHelper(spotLight, SpotLightHelper, "teal")
    useHelper(pointLight, PointLightHelper, 1, "hotpink")

    return (
        <>
            {/*<pointLight position={[-10, 0, -20]} color="lightblue" intensity={2.5} />*/}
            <group ref={group}>
                <pointLight ref={pointLight} color="red" position={[4, 4, 0]} intensity={5} />
            </group>
            {/*<spotLight castShadow position={[2, 5, 2]} ref={spotLight} angle={0.5} distance={20} />*/}
            <mesh ref={mesh} position={[0, 2, 0]} castShadow>
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color="lightblue" />
            </mesh>
            <gridHelper args={[30, 30, 30]} />
        </>
    )
}

const TestScene = () => {
    return (
        <Canvas colorManagement shadowMap camera={{ position: [-5, 5, 5] }}>
            <CameraControls />
            <fog attach="fog" args={["floralwhite", 0, 20]} />
            <Scene />
        </Canvas>
    )
}

export function App() {
    return (
        <GlowbuzzerApp>
            <PrefsButton />
            <StyledApp>
                <nav>
                    <ConnectTile />
                    <JogTile />
                    <JointDroTile />
                    <CartesianDro kinematicsConfigurationIndex={0} />
                </nav>
                <section>
                    <ToolPathTile />
                    {/*
                    <TestScene />
*/}
                </section>
            </StyledApp>
        </GlowbuzzerApp>
    )
}

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById("root")
)
