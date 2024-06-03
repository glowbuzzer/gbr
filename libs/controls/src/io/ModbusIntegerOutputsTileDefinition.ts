/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusIntegerOutputsTile } from "./ModbusIntegerOutputsTile"
import { ModbusIntegerOutputsTileHelp } from "./ModbusIntegerOutputsTileHelp"

export const ModbusIntegerOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.MODBUS_INTEGER_OUTPUTS,
    name: "Modbus Integer Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(ModbusIntegerOutputsTile, {}, null),
    renderHelp: () => createElement(ModbusIntegerOutputsTileHelp, {}, null)
}
