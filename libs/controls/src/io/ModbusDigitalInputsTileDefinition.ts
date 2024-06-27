/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusDigitalInputsTile } from "./ModbusDigitalInputsTile"
import { ModbusDigitalInputsTileHelp } from "./ModbusDigitalInputsTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const ModbusDigitalInputsTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.MODBUS_DIGITAL_INPUTS)
    .name("Modbus Digital Inputs")
    .placement(2, 1)
    .render(
        () => createElement(ModbusDigitalInputsTile, {}, null),
        () => createElement(ModbusDigitalInputsTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
