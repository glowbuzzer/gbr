/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    AnalogInputsTile,
    AnalogInputsTileHelp,
    AnalogOutputsTile,
    AnalogOutputsTileHelp,
    CartesianDroTile,
    CartesianDroTileHelp,
    ConnectSettings,
    ConnectTile,
    DigitalInputsTile,
    DigitalInputsTileHelp,
    DigitalOutputsTile,
    DigitalOutputsTileHelp,
    FeedRateTile,
    FeedRateTileHelp,
    GCodeTile,
    GCodeTileHelp,
    IntegerInputsTile,
    IntegerInputsTileHelp,
    IntegerOutputsTile,
    IntegerOutputsTileHelp,
    JogCartesianTile,
    JogJointsTile,
    JointDroTile,
    JointDroTileHelp,
    StateMachineToolsTile,
    StateMachineToolsTileHelp,
    TasksTile,
    TasksTileHelp,
    TelemetryTile,
    TelemetryTileSettings,
    ToolPathTile,
    ToolPathTileHelp,
    ToolsTile,
    ToolsTileHelp
} from "@glowbuzzer/controls"
import { SpindleTile } from "./spindle/SpindleTile"
import * as React from "react"
import { DockTileDefinition } from "./dock/DockTileDefinition"
import { ConnectTabButtons, ConnectTileHelp } from "./connect"
import { FramesTile } from "./frames/FramesTile"
import { ConfigEditTile } from "./config/ConfigEditTile"
import { PointsTile } from "./points/PointsTile"

export enum GlowbuzzerTileIdentifiers {
    CONNECT = "CONNECT",
    CONFIG_EDIT = "CONFIG_EDIT",
    JOG_CARTESIAN = "CARTESIAN_JOG",
    JOG_JOINT = "JOINT_JOG",
    THREE_DIMENSIONAL_SCENE = "THREE_DIMENSIONAL_SCENE",
    GCODE = "GCODE",
    FEEDRATE = "FEEDRATE",
    SPINDLE = "SPINDLE",
    DIGITAL_INPUTS = "DIGITAL_INPUTS",
    ANALOG_INPUTS = "ANALOG_INPUTS",
    INTEGER_INPUTS = "INTEGER_INPUTS",
    DIGITAL_OUTPUTS = "DIGITAL_OUTPUTS",
    ANALOG_OUTPUTS = "ANALOG_OUTPUTS",
    INTEGER_OUTPUTS = "INTEGER_OUTPUTS",
    CARTESIAN_DRO = "CARTESIAN_DRO",
    JOINT_DRO = "JOINT_DRO",
    FRAMES = "FRAMES",
    POINTS = "POINTS",
    TOOLS = "TOOLS",
    TASKS = "TASKS",
    TELEMETRY = "TELEMETRY",
    STATE_MACHINE_TOOLS = "STATE_MACHINE_TOOLS"
}

export const GlowbuzzerTileDefinitionList: DockTileDefinition[] = [
    {
        id: GlowbuzzerTileIdentifiers.CONNECT,
        name: "Connection",
        enableDrag: false, // don't allow connect tile to be moved
        enableClose: false, // or closed!
        render: ConnectTile,
        renderSettings: () => ConnectSettings,
        renderButtons: ConnectTabButtons,
        renderHelp: ConnectTileHelp,
        defaultPlacement: {
            column: 0,
            row: 0
        },
        config: {
            enableWithoutConnection: true
        }
    },
    {
        id: GlowbuzzerTileIdentifiers.JOG_CARTESIAN,
        name: "Cartesian Jog",
        defaultPlacement: {
            column: 0,
            row: 1
        },
        render: () => <JogCartesianTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.JOG_JOINT,
        name: "Joint Jog",
        defaultPlacement: {
            column: 0,
            row: 1
        },
        render: () => <JogJointsTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.THREE_DIMENSIONAL_SCENE,
        name: "Toolpath",
        enableClose: false,
        defaultPlacement: {
            column: 1,
            row: 0
        },
        render: () => <ToolPathTile />,
        renderHelp: () => <ToolPathTileHelp />,
        config: {
            enableWithoutConnection: true
        }
    },
    {
        id: GlowbuzzerTileIdentifiers.FEEDRATE,
        name: "Feedrate",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        render: () => <FeedRateTile />,
        renderHelp: () => <FeedRateTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.GCODE,
        name: "GCode",
        defaultPlacement: {
            column: 1,
            row: 1
        },
        render: () => <GCodeTile />,
        renderHelp: () => <GCodeTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.FRAMES,
        name: "Frames",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        render: () => <FramesTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.POINTS,
        name: "Points",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        render: () => <PointsTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.CARTESIAN_DRO,
        name: "Cartesian DRO",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        render: () => <CartesianDroTile clipboardMode={true} />,
        renderHelp: () => <CartesianDroTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.JOINT_DRO,
        name: "Joint DRO",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        render: () => <JointDroTile />,
        renderHelp: () => <JointDroTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.CONFIG_EDIT,
        name: "Config Editor",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        render: () => <ConfigEditTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.SPINDLE,
        name: "Spindle",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        render: () => <SpindleTile />
    },
    {
        id: GlowbuzzerTileIdentifiers.DIGITAL_INPUTS,
        name: "Digital Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        render: () => <DigitalInputsTile />,
        renderHelp: () => <DigitalInputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.INTEGER_INPUTS,
        name: "Integer Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        render: () => <IntegerInputsTile />,
        renderHelp: () => <IntegerInputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.ANALOG_INPUTS,
        name: "Analog Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        render: () => <AnalogInputsTile />,
        renderHelp: () => <AnalogInputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.DIGITAL_OUTPUTS,
        name: "Digital Outputs",
        defaultPlacement: {
            column: 2,
            row: 2
        },
        render: () => <DigitalOutputsTile />,
        renderHelp: () => <DigitalOutputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.INTEGER_OUTPUTS,
        name: "Integer Outputs",
        defaultPlacement: {
            column: 2,
            row: 2
        },
        render: () => <IntegerOutputsTile />,
        renderHelp: () => <IntegerOutputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.ANALOG_OUTPUTS,
        name: "Analog Outputs",
        defaultPlacement: {
            column: 2,
            row: 2
        },
        render: () => <AnalogOutputsTile />,
        renderHelp: () => <AnalogOutputsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.TOOLS,
        name: "Tools",
        defaultPlacement: {
            column: 2,
            row: 2
        },
        render: () => <ToolsTile />,
        renderHelp: () => <ToolsTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.TASKS,
        name: "Tasks",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        render: () => <TasksTile />,
        renderHelp: () => <TasksTileHelp />
    },
    {
        id: GlowbuzzerTileIdentifiers.STATE_MACHINE_TOOLS,
        name: "State Machine Tools",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        render: () => <StateMachineToolsTile />,
        renderHelp: () => <StateMachineToolsTileHelp />,
        excludeByDefault: true
    },
    {
        id: GlowbuzzerTileIdentifiers.TELEMETRY,
        name: "Telemetry",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        render: () => <TelemetryTile />,
        renderSettings: () => TelemetryTileSettings
        // excludeByDefault: true
    }
]

export const GlowbuzzerTileDefinitions: {
    [key in GlowbuzzerTileIdentifiers]?: DockTileDefinition
} = Object.fromEntries(GlowbuzzerTileDefinitionList.map(tile => [tile.id, tile]))
