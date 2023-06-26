/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import React from "react"

import "./App.css"
import {
    CartesianDroTileDefinition,
    CartesianJogTileDefinition,
    ConnectTileDefinition,
    DigitalOutputsTileDefinition,
    DockLayout,
    DockLayoutProvider,
    DockTileDefinitionBuilder,
    FeedRateTileDefinition,
    FramesTileDefinition,
    GCodeTileDefinition,
    JointDroTileDefinition,
    JointJogTileDefinition,
    PointsTileDefinition,
    SpindleTileDefinition,
    TelemetryTileDefinition,
    ThreeDimensionalSceneTileDefinition,
    ToolsTileDefinition
} from "@glowbuzzer/controls"
import { ExampleAppMenu } from "../../../util/ExampleAppMenu"
import { CncScene } from "./CncScene"
import {
    ActivityApi,
    ActivityBuilder,
    GCodeContextProvider,
    GCodeContextType,
    PointsConfig,
    useFrame,
    useToolList
} from "@glowbuzzer/store"
import { ToolHolderConstants } from "./constants"

export const App = () => {
    const toolList = useToolList()
    const toolHolderFrame = useFrame(ToolHolderConstants.frameIndex)

    const CustomThreeDimensionalSceneTileDefinition = DockTileDefinitionBuilder(
        ThreeDimensionalSceneTileDefinition
    )
        .render(() => <CncScene />)
        .build()

    const { spacing, holderToolOffset } = ToolHolderConstants
    const { x: originX, y: originY, z: originZ } = toolHolderFrame.translation
    const { x: holderToolOffsetX, y: holderToolOffsetY, z: holderToolOffsetZ } = holderToolOffset

    const context: GCodeContextType = {
        handleToolChange(
            kinematicsConfigurationIndex: number,
            currentToolIndex: number,
            newToolIndex: number,
            api: ActivityApi
        ): ActivityBuilder[] {
            const currentToolLength = toolList[currentToolIndex].translation.z
            const newToolLength = toolList[newToolIndex].translation.z
            console.log(
                "tool change from " + currentToolIndex + " to " + newToolIndex,
                "lengths",
                currentToolLength,
                newToolLength
            )
            // if (newToolIndex === currentToolIndex) {
            //     // nothing to do
            //     return []
            // }
            const SAFE_Z = 120
            function pos(toolIndex: number, toolSelected: boolean): PointsConfig {
                const z =
                    originZ +
                    // holderToolOffsetZ +
                    SAFE_Z +
                    (toolSelected ? toolList[toolIndex].translation.z : 0) -
                    32
                console.log("pos", toolIndex, toolSelected, z)
                return {
                    translation: {
                        x: originX + (toolIndex - 1) * spacing + holderToolOffsetX,
                        y: originY + holderToolOffsetY,
                        z
                    },
                    frameIndex: 0 /* world */
                }
            }
            const drop_existing =
                currentToolIndex > 0
                    ? [
                          api.moveToPosition().setFromPoint(pos(currentToolIndex, true)),
                          api.dwell(200),
                          api.moveToPosition(0, 0, SAFE_Z).relative(true),
                          api.dwell(200),
                          api.setToolOffset(0),
                          api.dwell(200),
                          api.moveToPosition(0, 0, -SAFE_Z).relative(true)
                      ]
                    : []
            return [
                api.spindle(0, false),
                api.moveToPosition(null, null, 0), // let's just get to a safe Z
                ...drop_existing,
                api.dwell(100),
                api.moveToPosition().setFromPoint(pos(newToolIndex, false)),
                api.dwell(100),
                api.moveToPosition(0, 0, SAFE_Z).relative(true),
                api.dwell(200),
                api.setToolOffset(newToolIndex),
                api.dwell(200),
                api.moveToPosition(0, 0, -SAFE_Z).relative(true),
                api.dwell(200)
            ]
        }
    }
    return (
        <GCodeContextProvider value={context}>
            <DockLayoutProvider
                tiles={[
                    CartesianDroTileDefinition,
                    JointDroTileDefinition,
                    CartesianJogTileDefinition,
                    JointJogTileDefinition,
                    ConnectTileDefinition,
                    CustomThreeDimensionalSceneTileDefinition,
                    GCodeTileDefinition,
                    FramesTileDefinition,
                    PointsTileDefinition,
                    ToolsTileDefinition,
                    FeedRateTileDefinition,
                    TelemetryTileDefinition,
                    SpindleTileDefinition,
                    DigitalOutputsTileDefinition
                ]}
            >
                <ExampleAppMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GCodeContextProvider>
    )
}
