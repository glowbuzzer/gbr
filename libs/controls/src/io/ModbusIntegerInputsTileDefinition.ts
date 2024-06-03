/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusIntegerInputsTile } from "./ModbusIntegerInputsTile"
import { ModbusIntegerInputsTileHelp } from "./ModbusIntegerInputsTileHelp"

export const ModbusIntegerInputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.MODBUS_INTEGER_INPUTS,
    name: "Modbus Integer Inputs",
    defaultPlacement: {
        column: 2,
        row: 1
    },
    render: () => createElement(ModbusIntegerInputsTile, {}, null),
    renderHelp: () => createElement(ModbusIntegerInputsTileHelp, {}, null)
}
