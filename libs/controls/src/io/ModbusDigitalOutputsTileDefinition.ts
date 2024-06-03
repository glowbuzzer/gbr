/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { ModbusDigitalOutputsTile } from "./ModbusDigitalOutputsTile"
import { ModbusDigitalOutputsTileHelp } from "./ModbusDigitalOutputsTileHelp"

export const ModbusDigitalOutputsTileDefinition = {
    id: GlowbuzzerTileIdentifiers.MODBUS_DIGITAL_OUTPUTS,
    name: "Modbus Digital Outputs",
    defaultPlacement: {
        column: 2,
        row: 2
    },
    render: () => createElement(ModbusDigitalOutputsTile, {}, null),
    renderHelp: () => createElement(ModbusDigitalOutputsTileHelp, {}, null)
}
