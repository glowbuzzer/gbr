/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerTileIdentifiers } from "../GlowbuzzerTileIdentifiers"
import { createElement } from "react"
import { TasksTile } from "./TasksTile"
import { TasksTileHelp } from "./TasksTileHelp"
import { DockTileDefinitionBuilder } from "../dock"

export const TasksTileDefinition = DockTileDefinitionBuilder()
    .id(GlowbuzzerTileIdentifiers.TASKS)
    .name("Tasks")
    .placement(0, 2)
    .render(
        () => createElement(TasksTile, {}, null),
        () => createElement(TasksTileHelp, {}, null)
    )
    .requiresConnection()
    .build()
