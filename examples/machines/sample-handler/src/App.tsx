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
import { JobTile } from "./JobTile"

const CustomSceneTile = DockTileDefinitionBuilder(ThreeDimensionalSceneTileDefinition)
    .render(() => {
        return <Scene />
    })
    .build()

const JobTileDefition = DockTileDefinitionBuilder()
    .id("job-tile")
    .name("Job")
    .placement(0, 0)
    .render(() => <JobTile />)
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
                JobTileDefition,
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
