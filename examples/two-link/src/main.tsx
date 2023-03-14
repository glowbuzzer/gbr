import * as React from "react"
import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { Group, Object3D, Vector3 } from "three"

import {
    AnalogInputsTileDefinition,
    AnalogOutputsTileDefinition,
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    Frustum,
    GCodeTileDefinition,
    GlowbuzzerApp,
    IntegerInputsTileDefinition,
    IntegerOutputsTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

import { ExampleAppMenu } from "../../util/ExampleAppMenu"
import { useKinematics } from "@glowbuzzer/store"
import { initializeStepLoader, loadStepFile } from "../../util/stepLoader"
import { Environment } from "@react-three/drei"

initializeStepLoader()

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

const TwoLinkArm = ({ children = null }) => {
    const { jointPositions } = useKinematics(0)
    const [links, setLinks] = useState<Object3D[]>([new Object3D(), new Object3D()])
    const link1Ref = React.useRef<Group>()
    const link2Ref = React.useRef<Group>()

    useEffect(() => {
        Promise.all(
            ["L0", "L1"].map(linkName => loadStepFile(`/assets/2link/${linkName}.STEP`))
        ).then(setLinks)
    }, [])

    useEffect(() => {
        link1Ref.current.rotation.set(0, 0, jointPositions[0] || 0)
        link2Ref.current.rotation.set(0, 0, jointPositions[1] || 0)
    }, [jointPositions])

    const [link1, link2] = links

    return (
        <group ref={link1Ref}>
            <primitive object={link1} />
            <group ref={link2Ref} position={new Vector3(0.15 * 1000, 0, 0)}>
                <primitive object={link2} />
                <group position={new Vector3(0.15 * 1000, 0, 0)}>{children}</group>
            </group>
        </group>
    )
}

const CustomSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile>
                <TwoLinkArm>
                    <Frustum />
                </TwoLinkArm>
                <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr" />
            </ThreeDimensionalSceneTile>
        )
    })
    .build()

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp appName={"two-link"}>
            <DockLayoutProvider
                tiles={[
                    AppIntroTileDefinition,
                    CustomSceneTile,
                    ConnectTileDefinition,
                    CartesianJogTileDefinition,
                    CartesianDroTileDefinition,
                    JointDroTileDefinition,
                    JointJogTileDefinition,
                    FeedRateTileDefinition,
                    GCodeTileDefinition,
                    AnalogInputsTileDefinition,
                    AnalogOutputsTileDefinition,
                    DigitalInputsTileDefinition,
                    DigitalOutputsTileDefinition,
                    IntegerInputsTileDefinition,
                    IntegerOutputsTileDefinition
                ]}
            >
                <ExampleAppMenu title={"Two Link Arm"} />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </StrictMode>
)
