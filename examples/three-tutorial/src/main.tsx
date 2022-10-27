import * as React from "react"
import { useState, StrictMode, useRef, useEffect, forwardRef, Ref } from "react"
import { createRoot } from "react-dom/client"
import * as THREE from "three"
import { Switch, Space } from "antd"
import {
    OrbitControls,
    Line,
    Sphere,
    Box,
    Html,
    Text,
    PerspectiveCamera,
    Points,
    Point,
    PointMaterial,
    PivotControls,
    useTexture,
    useHelper,
    Stage,
    Plane
} from "@react-three/drei"

import { useLoader, useFrame, useThree } from "@react-three/fiber"

import {
    AnalogInputsTile,
    AnalogOutputsTile,
    CartesianDroTile,
    ConnectTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    GCodeTile,
    GlowbuzzerApp,
    IntegerInputsTile,
    IntegerOutputsTile,
    RobotModel,
    JogTile,
    PreferencesDialog,
    ThreeDimensionalSceneTile,
    JointDroTile,
    Tile
} from "@glowbuzzer/controls"

import { Button } from "antd"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import styled from "styled-components"
import { StandardButtons } from "../../util/StandardButtons"

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog open={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

const ExampleSphere = () => {
    return (
        <Sphere position={[300, 300, 0]} scale={10}>
            <meshBasicMaterial color="red" />
        </Sphere>
    )
}

const ExampleLighting = React.forwardRef<THREE.Mesh, any>((props, ref) => {
    const spotRef = useRef(null)
    const pointRef1 = useRef()
    const { scene } = useThree()
    useHelper(spotRef, THREE.SpotLightHelper, "cyan")
    useHelper(pointRef1, THREE.PointLightHelper, 100, "magenta")

    useEffect(() => {
        if (ref && ref.current) {
            spotRef.current.target = ref.current
            console.log("ref: ", ref && ref.current)
        }
    }, [scene])

    return (
        <>
            <ambientLight color={"white"} intensity={0.1} />
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

            <spotLight
                ref={spotRef}
                angle={(12 * Math.PI) / 180}
                position={[0, 0, 1000]}
                color={"red"}
                castShadow
            />
            {/*<pointLight*/}
            {/*    position={[0, 0, 200]}*/}
            {/*    intensity={1}*/}
            {/*    castShadow={true}*/}
            {/*    shadow-mapSize-height={1024}*/}
            {/*    shadow-mapSize-width={1024}*/}
            {/*    shadow-radius={20}*/}
            {/*    shadow-bias={-0.0001}*/}
            {/*/>*/}
        </>
    )
})

const ExampleBox = () => {
    const steelblue = new THREE.Color(0x4682b4)
    // const boxRef = useRef<THREE.Mesh>()
    const boxRef = useRef(null)

    // const props = useTexture({
    //     metalnessMap: "/textures/Metal030/Metal030_1K_Metalness.jpg",
    //     map: "/textures/Metal030/Metal030_1K_Color.jpg",
    //     roughnessMap: "/textures/Metal030/Metal030_1K_Roughness.jpg",
    //     normalMap: "/textures/Metal030/Metal030_1K_NormalGL.jpg",
    // })

    const props = useTexture({
        metalnessMap: "/textures/Metal024/Metal024_1K_Metalness.jpg",
        map: "/textures/Metal024/Metal024_1K_Color.jpg",
        roughnessMap: "/textures/Metal024/Metal024_1K_Roughness.jpg",
        normalMap: "/textures/Metal024/Metal024_1K_NormalGL.jpg"
        // displacementMap: "/textures/Metal024/Metal024_1K_Displacement.jpg",
    })

    useFrame(({ clock }) => {
        boxRef.current.rotation.x = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        boxRef.current.rotation.y = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        boxRef.current.rotation.z = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        boxRef.current.position.x = Math.sin(clock.elapsedTime) * 300
        boxRef.current.position.z = Math.sin(clock.elapsedTime) + 200
    })

    return (
        <>
            <mesh ref={boxRef} scale={200} position={[0, 0, 0]} castShadow>
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color="black" />
            </mesh>
            {/*<Box ref={boxRef} position={[0, 0, 0]} scale={200} castShadow={true}>*/}
            {/*    <meshStandardMaterial  {...props}*/}
            {/*    />*/}
            {/*</Box>*/}
            {/*    <ExampleLighting ref={boxRef}/>*/}
        </>
    )
}

const StyledApp = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: rgba(128, 128, 128, 0.05);

    * {
        // ensure flex elements can shrink when needed
        min-width: 0;
        min-height: 0;
    }

    .body {
        padding: 20px;
        flex-grow: 1;
        display: flex;
        gap: 20px;

        nav,
        section {
            display: flex;
            flex-direction: column;
            gap: 20px;

            > div {
                background: white;
            }
        }

        nav {
            > div {
                height: inherit;
                min-height: 100px;
            }
        }

        section {
            flex-grow: 1;

            > div:nth-child(2) {
                max-height: 30vh;
            }
        }
    }
`

const DEG90 = Math.PI / 2

const TX40_MODEL: RobotModel = {
    name: "tx40",
    config: [
        { alpha: -DEG90, limits: [-270, 270] },
        { alpha: 0, link_length: 0.225, teta: -DEG90, limits: [-270, 270] },
        { alpha: DEG90, offset: 0.035, teta: DEG90, limits: [-270, 270] },
        { alpha: -DEG90, offset: 0.225, limits: [-270, 270] },
        { alpha: DEG90, limits: [-270, 270] },
        { offset: 0.065, limits: [-270, 270] }
    ],
    offset: new THREE.Vector3(0, 0, 325),
    scale: 1000
}

function Scene() {
    const { scene } = useThree()
    const mesh = useRef()
    const spotLight = useRef()

    useFrame(({ clock }) => {
        mesh.current.rotation.x = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        mesh.current.rotation.y = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        mesh.current.rotation.z = (Math.sin(clock.elapsedTime) * Math.PI) / 4
        mesh.current.position.x = Math.sin(clock.elapsedTime) * 500
        mesh.current.position.z = Math.sin(clock.elapsedTime) + 300
    })

    useEffect(() => (spotLight.current.target = mesh.current), [scene])
    useHelper(spotLight, THREE.SpotLightHelper, "teal")

    return (
        <>
            <spotLight
                castShadow
                position={[0, 0, 1000]}
                ref={spotLight}
                angle={0.5}
                color={"yellow"}
                distance={1200}
            />
            <mesh ref={mesh} position={[0, 0, 0]} scale={200} castShadow>
                <boxGeometry attach="geometry" />
                <meshStandardMaterial attach="material" color="lightblue" />
            </mesh>
            <mesh receiveShadow>
                <planeBufferGeometry args={[2000, 2000]} attach="geometry" />
                <shadowMaterial attach="material" opacity={0.5} />
            </mesh>
            <gridHelper args={[30, 30, 30]} />
        </>
    )
}

export function App() {
    const [showRobot, setShowRobot] = useState(true)
    const maxExtent = val => {
        console.log(val)
    }

    return (
        <>
            <StyledApp>
                <StandardButtons>
                    <Space>
                        <Switch defaultChecked={true} onChange={setShowRobot} />
                        <div>Show robot</div>
                    </Space>
                </StandardButtons>
                <div className="body">
                    <nav>
                        <ConnectTile />
                        <JogTile />
                        <CartesianDroTile />
                        <FeedRateTile />
                    </nav>
                    <section>
                        <ThreeDimensionalSceneTile
                            model={showRobot && TX40_MODEL}
                            getExtent={maxExtent}
                            noLighting={false}
                            noControls={false}
                            noViewCube={false}
                            noCamera={false}
                        >
                            {/*<ExampleLighting/>*/}
                            {/*                  <ExampleSphere/>*/}
                            {/*<ExampleBox/>*/}
                            {/*<Plane*/}
                            {/*    receiveShadow*/}
                            {/*    // rotation={[-Math.PI / 2, 0, 0]}*/}
                            {/*    position={[0, -1, 0]}*/}
                            {/*    args={[1000, 1000]}*/}

                            {/*>*/}
                            {/*    <meshStandardMaterial attach="material" color={"yellow"} />*/}
                            {/*</Plane>*/}

                            {/*<Scene/>*/}
                        </ThreeDimensionalSceneTile>
                        <GCodeTile />
                    </section>
                    <nav>
                        <DigitalOutputsTile />
                        <DigitalInputsTile />
                        <AnalogOutputsTile />
                        <AnalogInputsTile />
                        <IntegerOutputsTile />
                        <IntegerInputsTile />
                        <JointDroTile />
                        <Tile title="three.js tutorial">
                            <p>This is the three.js tutorial</p>
                            <p>
                                You need to connect to an instance of GBC before using this demo.
                                Click the preferences button above to set the GBC websocket
                                endpoint.
                            </p>
                        </Tile>
                    </nav>
                </div>
            </StyledApp>
        </>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
