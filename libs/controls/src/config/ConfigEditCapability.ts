/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { UserCapabilityDefinition } from "../usermgmt"

export const ConfigEditCapability = {
    name: Symbol("ConfigEdit"),
    description: "Config Editor",
    ENABLED: Symbol("Ability to view and edit the configuration")
} as const satisfies UserCapabilityDefinition
