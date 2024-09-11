/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { UserCapabilityDefinition } from "@glowbuzzer/controls"

export const SimpleMoveCapability: UserCapabilityDefinition = {
    name: Symbol("SimpleMove"),
    description: "Simple Move Tile",
    READ: Symbol("Read simple move tile"),
    WRITE: Symbol("Write simple move tile")
}
