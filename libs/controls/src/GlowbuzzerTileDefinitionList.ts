/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CartesianDroTileDefinition, JointDroTileDefinition } from "./dro"
import { CartesianJogTileDefinition, JointJogTileDefinition } from "./jogging"
import { ConnectTileDefinition } from "./connect"
import { ConfigEditTileDefinition } from "./config"
import { ThreeDimensionalSceneTileDefinition } from "./scene"
import { GCodeTileDefinition } from "./gcode"
import { FeedRateTileDefinition } from "./feedrate"
import { SpindleTileDefinition } from "./spindle"
import {
    AnalogInputsTileDefinition,
    AnalogOutputsTileDefinition,
    DigitalInputsTileDefinition,
    DigitalOutputsTileDefinition,
    ModbusDigitalInputsTileDefinition,
    IntegerInputsTileDefinition,
    ModbusIntegerInputsTileDefinition,
    IntegerOutputsTileDefinition,
    SafetyDigitalInputsTileDefinition,
    SafetyDigitalOutputsTileDefinition
} from "./io"
import { FramesTileDefinition } from "./frames"
import { PointsTileDefinition } from "./points"
import { ToolsTileDefinition } from "./tools"
import { TasksTileDefinition } from "./tasks"
import { TelemetryTileDefinition } from "./telemetry"
import { StateMachineToolsTileDefinition } from "./dev"

/**
 * This is the complete list of glowbuzzer tile definitions. Be aware that if you import this list
 * into your project it will transitively import all of the glowbuzzer controls code, and all dependencies.
 * If you are only using a handful of tiles, you may want to import only the tiles you need.
 */
export const GlowbuzzerTileDefinitionList = [
    CartesianDroTileDefinition,
    JointDroTileDefinition,
    CartesianJogTileDefinition,
    JointJogTileDefinition,
    ConnectTileDefinition,
    ConfigEditTileDefinition,
    ThreeDimensionalSceneTileDefinition,
    GCodeTileDefinition,
    FeedRateTileDefinition,
    SpindleTileDefinition,
    DigitalInputsTileDefinition,
    SafetyDigitalInputsTileDefinition,
    ModbusDigitalInputsTileDefinition,
    ModbusIntegerInputsTileDefinition,
    AnalogInputsTileDefinition,
    IntegerInputsTileDefinition,
    DigitalOutputsTileDefinition,
    SafetyDigitalOutputsTileDefinition,
    AnalogOutputsTileDefinition,
    IntegerOutputsTileDefinition,
    FramesTileDefinition,
    PointsTileDefinition,
    ToolsTileDefinition,
    TasksTileDefinition,
    TelemetryTileDefinition,
    StateMachineToolsTileDefinition
]
