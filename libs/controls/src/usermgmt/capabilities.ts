/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

// Standard capabilities provided

import { UserCapabilityDefinition } from "./types"

export const UserManagementCapability: UserCapabilityDefinition = {
    name: Symbol("UserManagement"),
    description: "User Management",
    ALL: Symbol("Full user management capability")
}
