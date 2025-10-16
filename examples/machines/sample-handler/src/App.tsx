import {
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GCodeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    ThreeDimensionalSceneTile,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { config } from "./config"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import * as React from "react"
import { SampleHandler } from "./SampleHandler"
import { SampleTube } from "./SampleTube"
import { Environment } from "@react-three/drei"
import { CustomSpotLighting } from "./CustomSpotLighting"

const CustomSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return (
            <ThreeDimensionalSceneTile noLighting>
                <SampleHandler>
                    <SampleTube />
                </SampleHandler>
                <CustomSpotLighting position={[0, 0, 0]} />
                <Environment preset="dawn" blur={4} />
                {/*
                <Environment background={false} resolution={256}>
                    <Lightformer
                        intensity={2}
                        rotation-x={Math.PI / 2}
                        position={[0, 5, 0]}
                        scale={10}
                    />
                    <Lightformer intensity={1} position={[5, 0, 0]} scale={5} />
                    <Lightformer intensity={1} position={[-5, 0, 0]} scale={5} />
                    <Lightformer intensity={1} position={[0, 0, 5]} scale={5} />
                    <Lightformer intensity={1} position={[0, 0, -5]} scale={5} />
                </Environment>
*/}
            </ThreeDimensionalSceneTile>
        )
    })
    .build()
export const App = () => (
    <GlowbuzzerApp appName="sample-handler" configuration={config} autoOpEnabled>
        <DockLayoutProvider
            tiles={[
                CustomSceneTile,
                JointDroTileDefinition,
                JointJogTileDefinition,
                GCodeTileDefinition
            ]}
        >
            <ExampleAppMenu title={"Sample Handler"} />
            <DockLayout />
        </DockLayoutProvider>
    </GlowbuzzerApp>
)
