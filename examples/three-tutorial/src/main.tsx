import * as React from "react"
import {
    useState,
    StrictMode,
    useRef,
    useEffect,
    useContext,
    createContext,
    Suspense,
    forwardRef,
    useLayoutEffect
} from "react"
import * as THREE from 'three'
import {Switch, Space} from "antd"
import {Physics, useBox, useSphere, usePlane} from "@react-three/cannon"

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
    Plane,
} from "@react-three/drei"

import {useLoader, useFrame, useThree} from "@react-three/fiber"


import {
    DockLayout,
    DockLayoutProvider, DockTileDefinition,
    DockTileDefinitionBuilder,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions, GlowbuzzerTileIdentifiers, JogJointsTile,
    RobotModel,
    ThreeDimensionalSceneTile
} from "@glowbuzzer/controls"


import {Vector3} from "three"
import {createRoot} from "react-dom/client"
import {ExampleAppMenu} from "../../util/ExampleAppMenu"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import {appContext} from "../../convmc/src/app/AppContextType";

import {ChooseExample} from "./menuTile"
import {ExampleSphere} from "./exampleSphere"
import {ExampleTexture} from "./exampleTexture"
import {ExampleSpotlightOnObject} from "./exampleSpotlightOnObject"
import {ExamplePhysics} from "./examplePhysics"
import {ExampleSprites} from "./exampleSprites"
import {ExampleIndicators} from "./exampleIndicators"
import {ExampleShowObjectCoordinates} from "./exampleShowObjectCoordinates"
import {ExampleMoveObject} from "./exampleMoveObject";
import {ExampleCollisionDetection} from "./exampleCollisionDetection"
import {ExampleGripper} from "./exampleGripper"
import {ExampleSpring} from "./exampleSpring"
import {ExamplePendulum} from "./examplePendulum"
import {ExampleUI} from "./ExampleUI";
import {ExampleTriadPoints} from "./ExampleTriadPoints"

import {ActiveExampleContext} from "./activeExampleContext";
import {ExampleLaserCutting} from "./exampleLaserCutting";

const ChooseExampleTileDefinition: DockTileDefinition =
    {
        id: "chooseExample",
        name: "Choose Example",
        defaultPlacement: {
            column: 2,
            row: 0,
        },
        excludeByDefault: false,
        config: {
            enableWithoutConnection: true
        },
        render: () => <ChooseExample/>
    }


const DEG90 = Math.PI / 2

const TX40_MODEL: RobotModel = {
    name: "tx40",
    config: [
        {alpha: -DEG90, limits: [-270, 270]},
        {alpha: 0, link_length: 0.225, teta: -DEG90, limits: [-270, 270]},
        {alpha: DEG90, offset: 0.035, teta: DEG90, limits: [-270, 270]},
        {alpha: -DEG90, offset: 0.225, limits: [-270, 270]},
        {alpha: DEG90, limits: [-270, 270]},
        {offset: 0.065, limits: [-270, 270]}
    ],
    offset: new THREE.Vector3(0, 0, 325),
    scale: 1000
}

const ThreeTutorial = () => {

    // const [showRobot, setShowRobot] = useState(true)
    const maxExtent = (val) => {
        // console.log(val);
    }

    // const position = useKinematicsCartesianPosition(0).position.translation
    // const orientation = useKinematicsCartesianPosition(0).position.rotation
    // console.log(position)

    const {activeExample, setActiveExample} = useContext(ActiveExampleContext)
    console.log("main", activeExample)

    // exampleContent = <Html><h1>example1</h1></Html>
    // exampleContent = <Html><h1>example2</h1></Html>

    let exampleContent

    switch (activeExample) {
        case 1: {
            exampleContent = <ExampleSphere/>
            break
        }
        case 2: {
            exampleContent = <ExampleTexture/>
            break
        }
        case 3: {
            exampleContent = <ExampleSpotlightOnObject/>
            break
        }
        case 4: {
            exampleContent = <ExamplePhysics/>
            break
        }
        case 5: {
            exampleContent = <ExampleSprites i={5} j={6}/>
             break
        }
        case 6: {
            exampleContent = <ExampleShowObjectCoordinates/>
            break
        }
        case 7: {
            exampleContent = <ExampleMoveObject/>
            break
        }
        case 8: {
            exampleContent = <ExampleCollisionDetection/>
            break
        }
        case 9: {
            exampleContent = <ExampleTriadPoints/>
            break
        }

        case 10: {
            exampleContent = <ExampleUI/>
            break
        }
        case 11: {
            exampleContent = <ExamplePendulum/>
            break
        }
        case 12: {
            exampleContent = <ExampleGripper/>
            break
        }
        case 13: {
            exampleContent = <ExampleIndicators/>
            break
        }
        case 14: {
            exampleContent = <ExampleSpring/>
            break
        }
        case 15: {
            exampleContent = <ExampleLaserCutting/>
            break
        }

        default: {
            exampleContent = <Html><h1>Error</h1></Html>
            break
        }
    }
    return (<ThreeDimensionalSceneTile model={TX40_MODEL} noViewCube={true} noCamera={false} noGridHelper={false} noLighting={false}>{exampleContent}</ThreeDimensionalSceneTile>)
    // return (<ThreeDimensionalSceneTile noViewCube={true} noCamera={false} noGridHelper={true} noLighting={true}>{exampleContent}</ThreeDimensionalSceneTile>)
}

const CustomSceneTile = DockTileDefinitionBuilder(GlowbuzzerTileDefinitions.THREE_DIMENSIONAL_SCENE)
    .render(() => (<ThreeTutorial/>))
    .build()

const ActiveExampleProvider = ({children}) => {

    const [activeExample, setActiveExample] = useState<number | null>(1)

    console.log("provider render")
    return (
        <ActiveExampleContext.Provider value={{activeExample, setActiveExample}}>{children}</ActiveExampleContext.Provider>
    )

}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <ActiveExampleProvider>
                <DockLayoutProvider
                    appName={"three-tutorial"}
                    tiles={[
                        GlowbuzzerTileDefinitions.CONNECT,
                        GlowbuzzerTileDefinitions.CARTESIAN_JOG,
                        GlowbuzzerTileDefinitions.CARTESIAN_DRO,
                        GlowbuzzerTileDefinitions.JOINT_JOG,
                        GlowbuzzerTileDefinitions.JOINT_DRO,
                        GlowbuzzerTileDefinitions.DIGITAL_OUTPUTS,
                        GlowbuzzerTileDefinitions.INTEGER_OUTPUTS,
                        GlowbuzzerTileDefinitions.POINTS,
                        GlowbuzzerTileDefinitions.FRAMES,
                        GlowbuzzerTileDefinitions.CONFIG_EDIT,
                        ChooseExampleTileDefinition,
                        GlowbuzzerTileDefinitions.TOOLS,
                        CustomSceneTile,
                    ]}
                >
                    <ExampleAppMenu title="three-tutorial"/>
                    <DockLayout/>
                </DockLayoutProvider>
            </ActiveExampleProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
