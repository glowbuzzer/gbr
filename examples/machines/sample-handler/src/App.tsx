import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    GCodeTileDefinition,
    GlowbuzzerApp,
    JointDroTileDefinition,
    JointJogTileDefinition,
    ThreeDimensionalSceneTileDefinition
} from "@glowbuzzer/controls"
import { config } from "./config"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import * as React from "react"
import { Scene } from "./Scene"
import { appReducers } from "./store"
import { WorkflowTile } from "./WorkflowTile"

const CustomSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return <Scene />
    })
    .build()

const WorkflowTileDefinition = DockTileDefinitionBuilder()
    .id("workflow-tile")
    .name("Workflow")
    .placement(0, 0)
    .render(() => <WorkflowTile />)
    .build()

export const App = () => (
    <GlowbuzzerApp
        appName="sample-handler"
        configuration={config}
        autoOpEnabled
        additionalReducers={appReducers}
    >
        <DockLayoutProvider
            tiles={[
                CustomSceneTile,
                WorkflowTileDefinition,
                JointDroTileDefinition,
                JointJogTileDefinition,
                CartesianDroTileDefinition,
                CartesianJogTileDefinition,
                GCodeTileDefinition
            ]}
        >
            <ExampleAppMenu title={"Sample Handler"} />
            <DockLayout />
        </DockLayoutProvider>
    </GlowbuzzerApp>
)
