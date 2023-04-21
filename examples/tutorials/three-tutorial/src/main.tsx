import * as React from "react"
import { StrictMode, Suspense, useContext, useMemo, useState } from "react"
import { Html, useGLTF } from "@react-three/drei"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConfigEditTileDefinition,
    ConnectTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinition,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GlowbuzzerApp,
    IntegerOutputsTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    RobotKinematicsChainElement,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import { createRoot } from "react-dom/client"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { BasicRobotTelemetryPlayback } from "./BasicRobotTelemetryPlayback"
import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

import { ChooseExample } from "./menuTile"
import { ExampleTexture } from "./exampleTexture"
import { ExampleSpotlightOnObject } from "./exampleSpotlightOnObject"
import { ExamplePhysics } from "./examplePhysics"
import { ExampleSprites } from "./exampleSprites"
import { ExampleIndicators } from "./exampleIndicators"
import { ExampleShowObjectCoordinates } from "./exampleShowObjectCoordinates"
import { ExampleMoveObject } from "./exampleMoveObject"
import { ExampleCollisionDetection } from "./exampleCollisionDetection"
import { ExampleGripper } from "./exampleGripper"
import { ExampleSpring } from "./exampleSpring"
import { ExamplePendulum } from "./examplePendulum"
import { ExampleUI } from "./ExampleUI"
import { ExampleTriadPoints } from "./ExampleTriadPoints"
import { ActiveExampleContext } from "./activeExampleContext"
import { ExampleLaserCutting } from "./exampleLaserCutting"
import { ExamplePlayback } from "./examplePlayback"
import { useFrame, useJointPositions, useKinematicsConfiguration } from "@glowbuzzer/store"
import { Vector3 } from "three"
import { PlaybackTile } from "./playbackTile"
import { DemoMoveTile } from "./demoMoveTile"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"

const ChooseExampleTileDefinition: DockTileDefinition = {
    id: "chooseExample",
    name: "Choose Example",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    excludeByDefault: false,
    config: {
        enableWithoutConnection: true
    },
    render: () => <ChooseExample />
}

const PlaybackTileDefinition: DockTileDefinition = {
    id: "playback",
    name: "Playback telemetry",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    excludeByDefault: false,
    config: {
        enableWithoutConnection: true
    },
    render: () => <PlaybackTile />
}

const DemoMoveTileDefinition: DockTileDefinition = {
    id: "demoMove",
    name: "Demo move",
    defaultPlacement: {
        column: 2,
        row: 0
    },
    excludeByDefault: false,
    config: {
        enableWithoutConnection: true
    },
    render: () => <DemoMoveTile />
}

const DEG90 = Math.PI / 2

const TX40_KIN_CHAIN: RobotKinematicsChainElement[] = [
    { moveable: true },
    { rotateX: -DEG90, moveable: true, jointAngleAdjustment: -DEG90 },
    { rotateX: 0, translateX: 0.225, jointAngleAdjustment: DEG90, moveable: true },
    { rotateX: DEG90, translateZ: 0.035, moveable: true },
    { rotateX: -DEG90, translateZ: 0.225, moveable: true },
    { rotateX: DEG90, moveable: true },
    { translateZ: 0.065 }
]

const DEFAULT_POSITION = new Vector3(0, 0, 325)

const ThreeTutorial = () => {
    const jointPositions = useJointPositions(0)

    const startJointPositions = [0, 0, 0, 0, 0, 0]

    // const [jointPositions, setJointPositions] = useState(startJointPositions)

    // const setJointPos = (index, value) => {
    //     const newJointPositions = [...jointPositions]
    //     console.log("NEW JOINT POSITIONS", newJointPositions)
    //     newJointPositions[index] = value
    //     setJointPositions(newJointPositions)
    // }
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const newJointPositions = [...jointPositions]
    //         newJointPositions[0] = Math.random()
    //         newJointPositions[1] = Math.random()
    //         newJointPositions[2] = Math.random()
    //         setJointPositions(newJointPositions)
    //         console.log(jointPositions)
    //     }, 1000)
    //     return () => clearInterval(interval)
    // }, [])

    const { frameIndex } = useKinematicsConfiguration(0)
    const { translation, rotation } = useFrame(frameIndex, false)

    // const parts = useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(
    //     m => m.scene
    // )

    const parts = useMemo(
        () => useGLTF([0, 1, 2, 3, 4, 5, 6].map(j => `/assets/tx40/L${j}.glb`)).map(m => m.scene),
        []
    )

    // console.log("PARTS", parts)

    const maxExtent = val => {
        // console.log(val);
    }

    // const position = useKinematicsCartesianPosition(0).position.translation
    // const orientation = useKinematicsCartesianPosition(0).position.rotation
    // console.log(position)

    const { activeExample, setActiveExample } = useContext(ActiveExampleContext)

    let exampleContent

    switch (activeExample) {
        case 1: {
            // exampleContent = <ExampleSphere />
            exampleContent = <ExamplePlayback />
            break
        }
        case 2: {
            exampleContent = <ExampleTexture />
            break
        }
        case 3: {
            exampleContent = <ExampleSpotlightOnObject />
            break
        }
        case 4: {
            exampleContent = <ExamplePhysics />
            break
        }
        case 5: {
            exampleContent = <ExampleSprites i={5} j={6} />
            break
        }
        case 6: {
            exampleContent = <ExampleShowObjectCoordinates />
            break
        }
        case 7: {
            exampleContent = <ExampleMoveObject />
            break
        }
        case 8: {
            exampleContent = <ExampleCollisionDetection />
            break
        }
        case 9: {
            exampleContent = <ExampleTriadPoints />
            break
        }

        case 10: {
            exampleContent = <ExampleUI />
            break
        }
        case 11: {
            exampleContent = <ExamplePendulum />
            break
        }
        case 12: {
            exampleContent = <ExampleGripper />
            break
        }
        case 13: {
            exampleContent = <ExampleIndicators />
            break
        }
        case 14: {
            exampleContent = <ExampleSpring />
            break
        }
        case 15: {
            exampleContent = <ExampleLaserCutting />
            break
        }

        default: {
            exampleContent = (
                <Html>
                    <h1>Error</h1>
                </Html>
            )
            break
        }
    }

    return (
        <ThreeDimensionalSceneTile noViewCube>
            <BasicRobotTelemetryPlayback
                kinematicsChain={TX40_KIN_CHAIN}
                jointPositions={jointPositions}
                parts={parts}
                translation={translation || DEFAULT_POSITION}
                rotation={rotation}
                scale={1000}
            />

            {exampleContent}
            <DefaultEnvironment />
        </ThreeDimensionalSceneTile>
    )
}

const CustomSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => (
        <Suspense fallback={null}>
            <ThreeTutorial />
        </Suspense>
    ))
    .build()

const ActiveExampleProvider = ({ children }) => {
    const [activeExample, setActiveExample] = useState<number | null>(1)

    console.log("provider render")
    return (
        <ActiveExampleContext.Provider value={{ activeExample, setActiveExample }}>
            {children}
        </ActiveExampleContext.Provider>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName={"three-tutorial"}>
            <ActiveExampleProvider>
                <DockLayoutProvider
                    tiles={[
                        ConnectTileDefinition,
                        CartesianJogTileDefinition,
                        CartesianDroTileDefinition,
                        JointJogTileDefinition,
                        JointDroTileDefinition,
                        DigitalOutputsTileDefinition,
                        IntegerOutputsTileDefinition,
                        PointsTileDefinition,
                        FramesTileDefinition,
                        ConfigEditTileDefinition,
                        ChooseExampleTileDefinition,
                        ToolsTileDefinition,
                        CustomSceneTile,
                        FeedRateTileDefinition,
                        PlaybackTileDefinition,
                        DemoMoveTileDefinition
                    ]}
                >
                    <ExampleAppMenu title="three-tutorial" />
                    <DockLayout />
                </DockLayoutProvider>
            </ActiveExampleProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
