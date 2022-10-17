/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    AnalogInputsTile,
    CartesianDroTile,
    ConnectTile,
    DigitalInputsTile,
    IntegerInputsTile,
    JogCartesianTile,
    JogJointsTile,
    ToolPathTile
} from "@glowbuzzer/controls"
import { SpindleTile } from "../spindle/SpindleTile"
import * as React from "react"
import { GlowbuzzerDockComponentDefinition } from "./GlowbuzzerDockComponentDefinition"
import { ToolpathShowFramesButton } from "../toolpath/ToolpathShowFramesButton"
import { ConnectTabButtons, ConnectTileHelp } from "../connect"
import { FramesTile } from "../frames/FramesTile"
import { ConfigEditTile } from "../config/ConfigEditTile"
import { PointsTile } from "../points/PointsTile"

export enum GlowbuzzerDockComponent {
    CONNECT = "connect",
    CONFIG_EDIT = "config-edit",
    JOGGING = "jogging",
    JOG_CARTESIAN = "jog-cartesian",
    JOG_JOINT = "jog-joint",
    TOOLPATH = "toolpath",
    SPINDLE = "spindle",
    DIGITAL_INPUTS = "digital-inputs",
    ANALOG_INPUTS = "analog-inputs",
    INTEGER_INPUTS = "integer-inputs",
    CARTESIAN_DRO = "cartesian-dro",
    FRAMES = "frames",
    POINTS = "points"
}

export const GlowbuzzerDockStandardComponentList: GlowbuzzerDockComponentDefinition[] = [
    {
        id: GlowbuzzerDockComponent.CONNECT,
        name: "Connection",
        enableDrag: false, // don't allow connect tile to be moved
        enableClose: false, // or closed!
        factory: () => <ConnectTile />,
        buttonsFactory: () => <ConnectTabButtons />,
        helpFactory: () => <ConnectTileHelp />,
        config: {
            enableWithoutConnection: true
        }
    },
    {
        id: GlowbuzzerDockComponent.JOG_CARTESIAN,
        name: "Cartesian Jog",
        defaultPlacement: {
            column: 0,
            row: 1
        },
        factory: () => <JogCartesianTile />
    },
    {
        id: GlowbuzzerDockComponent.JOG_JOINT,
        name: "Joint Jog",
        defaultPlacement: {
            column: 0,
            row: 1
        },
        factory: () => <JogJointsTile />
    },
    {
        id: GlowbuzzerDockComponent.TOOLPATH,
        name: "Toolpath",
        enableClose: false,
        defaultPlacement: {
            column: 1,
            row: 0
        },
        factory: () => <ToolPathTile />,
        settingsFactory: () => <div>TOOLPATH SETTINGS GO HERE!</div>,
        buttonsFactory: () => <ToolpathShowFramesButton />,
        config: {
            enableWithoutConnection: true
        }
    },
    {
        id: GlowbuzzerDockComponent.FRAMES,
        name: "Frames",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        factory: () => <FramesTile />
    },
    {
        id: GlowbuzzerDockComponent.POINTS,
        name: "Points",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        factory: () => <PointsTile />
    },
    {
        id: GlowbuzzerDockComponent.CARTESIAN_DRO,
        name: "Cartesian DRO",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        factory: () => <CartesianDroTile />
    },
    {
        id: GlowbuzzerDockComponent.CONFIG_EDIT,
        name: "Config Editor",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <ConfigEditTile />
    },
    {
        id: GlowbuzzerDockComponent.SPINDLE,
        name: "Spindle",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        factory: () => <SpindleTile />
    },
    {
        id: GlowbuzzerDockComponent.DIGITAL_INPUTS,
        name: "Digital Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <DigitalInputsTile />
    },
    {
        id: GlowbuzzerDockComponent.INTEGER_INPUTS,
        name: "Integer Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <IntegerInputsTile />
    },
    {
        id: GlowbuzzerDockComponent.ANALOG_INPUTS,
        name: "Analog Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <AnalogInputsTile />
    }
]
