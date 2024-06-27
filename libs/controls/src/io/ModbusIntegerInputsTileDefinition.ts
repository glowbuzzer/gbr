/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusIntegerInputsTile } from "./ModbusIntegerInputsTile"
import { ModbusIntegerInputsTileHelp } from "./ModbusIntegerInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const ModbusIntegerInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.MODBUS_INTEGER_INPUTS)
    .name("Modbus Integer Inputs")
    .placement(2, 1)
    .render(
        () => createElement(ModbusIntegerInputsTile, {}, null),
        () => createElement(ModbusIntegerInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
