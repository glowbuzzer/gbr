/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { SerialCommunicationsTile } from "./SerialCommunicationsTile"

export const SerialCommunicationsTileDefinition = DockTileDefinitionBuilder()
    .id("serial-comms")
    .name("Serial Comms")
    .placement(2, 2)
    .render(() => React.createElement(SerialCommunicationsTile))
    .build()
