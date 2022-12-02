/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createElement } from "react"
import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { ConnectTile } from "./ConnectTile"
import { ConnectSettings } from "./ConnectSettings"
import { ConnectTabButtons } from "./ConnectTabButtons"
import { ConnectTileHelp } from "./ConnectTileHelp"

export const ConnectTileDefinition = {
    id: GlowbuzzerTileIdentifiers.CONNECT,
    name: "Connection",
    enableDrag: false, // don't allow connect tile to be moved
    enableClose: false, // or closed!
    render: () => createElement(ConnectTile, {}, null),
    renderSettings: () => ConnectSettings,
    renderButtons: () => createElement(ConnectTabButtons, {}, null),
    renderHelp: () => createElement(ConnectTileHelp, {}, null),
    defaultPlacement: {
        column: 0,
        row: 0
    },
    config: {
        enableWithoutConnection: true
    }
}
