import * as React from "react"
import {useState, StrictMode, useRef, useEffect, forwardRef, Ref} from "react"
import {createRoot} from "react-dom/client"
import * as THREE from 'three'
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

import {useLoader, useFrame } from "@react-three/fiber"


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
    ToolPathTile,
    JointDroTile,
    Tile
} from "@glowbuzzer/controls"

import {Button} from "antd"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import styled from "styled-components";
import {StandardButtons} from "../../util/StandardButtons";

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog open={visible} onClose={() => setVisible(false)} />
        </div>
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




const TWOLINK_MODEL: RobotModel = {
    name: "2link",
    config: [
        { alpha: 0, link_length: 0.15, skip_link: true },
        { alpha: 0, teta:0, link_length: 0.15, limits: [-180, 180] },
    ],
    offset: new THREE.Vector3(0, 0, 0),
    scale: 1000
}



export function App() {
    const [showRobot, setShowRobot] = useState(true)
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
                        <ConnectTile/>
                        <JogTile/>
                        <CartesianDroTile/>
                        <FeedRateTile/>
                    </nav>
                    <section>
                        <ToolPathTile model={showRobot && TWOLINK_MODEL}>
                        </ToolPathTile>
                        <GCodeTile/>
                    </section>
                    <nav>
                        <DigitalOutputsTile/>
                        <DigitalInputsTile/>
                        <AnalogOutputsTile/>
                        <AnalogInputsTile/>
                        <IntegerOutputsTile/>
                        <IntegerInputsTile/>
                        <JointDroTile/>
                        <Tile title="Two-link example">
                            <p>This simple example is the GBR side of the two-link arm tutorial.</p>
                            <p>
                                You need to connect to an instance of GBC before using this demo. Click the
                                preferences button above to set the GBC websocket endpoint.
                            </p>
                        </Tile>
                    </nav>
                </div>
            </StyledApp>
        </>

    );
}


const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)