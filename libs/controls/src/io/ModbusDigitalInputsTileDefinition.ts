/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusDigitalInputsTile } from "./ModbusDigitalInputsTile"
import { ModbusDigitalInputsTileHelp } from "./ModbusDigitalInputsTileHelp"

export const ModbusDigitalInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.MODBUS_DIGITAL_INPUTS,
    name: "Modbus Digital Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(ModbusDigitalInputsTile, {}, null),
    renderHelp: () => createElement(ModbusDigitalInputsTileHelp, {}, null)
}
