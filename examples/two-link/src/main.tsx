import * as React from "react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as THREE from "three"

import {
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitions,
    RobotModel,
    ThreeDimensionalSceneTile
} from "@glowbuzzer/controls"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"

const TWOLINK_MODEL: RobotModel = {
    name: "2link",
    config: [
        { alpha: 0, link_length: 0.15, skip_link: true },
        { alpha: 0, teta: 0, link_length: 0.15, limits: [-180, 180] }
    ],
    offset: new THREE.Vector3(0, 0, 0),
    scale: 1000
}

const AppIntroTileDefinition = DockTileDefinitionBuilder()
    .id("app-intro")
    .name("Introduction")
    .placement(2, 0)
    .render(() => (
        <div style={{ padding: "10px" }}>
            <p>This simple example is the GBR side of the two-link arm tutorial.</p>
            <p>
                You need to connect to an instance of GBC before using this demo. Click the
                preferences button above to set the GBC websocket endpoint.
            </p>
        </div>
    ))
    .build()

const CustomSceneTile = DockTileDefinitionBuilder(GlowbuzzerTileDefinitions.THREE_DIMENSIONAL_SCENE)
    .render(() => <ThreeDimensionalSceneTile model={TWOLINK_MODEL} />)
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"two-link"}
                tiles={[
                    AppIntroTileDefinition,
                    CustomSceneTile,
                    GlowbuzzerTileDefinitions.CONNECT,
                    GlowbuzzerTileDefinitions.CARTESIAN_JOG,
                    GlowbuzzerTileDefinitions.CARTESIAN_DRO,
                    GlowbuzzerTileDefinitions.JOINT_DRO,
                    GlowbuzzerTileDefinitions.JOINT_JOG,
                    GlowbuzzerTileDefinitions.FEEDRATE,
                    GlowbuzzerTileDefinitions.GCODE,
                    GlowbuzzerTileDefinitions.ANALOG_INPUTS,
                    GlowbuzzerTileDefinitions.ANALOG_OUTPUTS,
                    GlowbuzzerTileDefinitions.DIGITAL_INPUTS,
                    GlowbuzzerTileDefinitions.DIGITAL_OUTPUTS,
                    GlowbuzzerTileDefinitions.INTEGER_INPUTS,
                    GlowbuzzerTileDefinitions.INTEGER_OUTPUTS
                ]}
            >
                <ExampleAppMenu title={"Two Link Arm"} />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
