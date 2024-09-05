/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { UserCapabilityDefinition } from "../usermgmt"

export const FlowMakerCapability = {
    name: Symbol("Flow"),
    description: "Flow Maker capability",
    EDIT: Symbol("Ability to create and edit flows"),
    RUN: Symbol("Ability to run flows")
} as const satisfies UserCapabilityDefinition
