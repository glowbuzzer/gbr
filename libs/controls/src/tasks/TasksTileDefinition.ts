/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { TasksTile } from "./TasksTile"
import { TasksTileHelp } from "./TasksTileHelp"

export const TasksTileDefinition = {
    id: GlowbuzzerTileIdentifiers.TASKS,
    name: "Tasks",
    defaultPlacement: {
        column: 0,
        row: 2
    },
    render: () => createElement(TasksTile, {}, null),
    renderHelp: () => createElement(TasksTileHelp, {}, null)
}
