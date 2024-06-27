/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusDigitalOutputsTile } from "./ModbusDigitalOutputsTile"
import { ModbusDigitalOutputsTileHelp } from "./ModbusDigitalOutputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const ModbusDigitalOutputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.MODBUS_DIGITAL_OUTPUTS)
    .name("Modbus Digital Outputs")
    .placement(2, 2)
    .render(
        () => createElement(ModbusDigitalOutputsTile, {}, null),
        () => createElement(ModbusDigitalOutputsTileHelp, {}, null)
    )
    .requiresOperationEnabled()
    .build()
