/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { UserCapabilityDefinition } from "../usermgmt"

export const ConfigEditCapability: UserCapabilityDefinition = {
    name: Symbol("ConfigEdit"),
    description: "Config Editor",
    ENABLED: Symbol("Ability to view and edit the configuration")
}
