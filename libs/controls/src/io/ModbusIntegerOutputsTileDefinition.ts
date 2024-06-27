/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusIntegerOutputsTile } from "./ModbusIntegerOutputsTile"
import { ModbusIntegerOutputsTileHelp } from "./ModbusIntegerOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const ModbusIntegerOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.MODBUS_INTEGER_OUTPUTS)
    .name("Modbus Integer Outputs")
    .placement(2, 2)
    .render(
        () => createElement(ModbusIntegerOutputsTile, {}, null),
        () => createElement(ModbusIntegerOutputsTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
