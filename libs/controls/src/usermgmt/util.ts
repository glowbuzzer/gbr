/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { ConfigEditCapability } from "../config"
import { UserManagementCapability } from "./capabilities"
import { UserRoleDefinition } from "./types"
import { FlowMakerCapability } from "../flow"

export const ADMIN_ROLE_NAME = "admin"

export class RoleBuilder {
    private readonly role: UserRoleDefinition

    public constructor(name: string) {
        this.role = {
            name,
            capabilities: []
        }
    }

    static defaultAdminRole() {
        return new RoleBuilder(ADMIN_ROLE_NAME).addCapabilities(
            ConfigEditCapability.ENABLED,
            UserManagementCapability.ALL,
            FlowMakerCapability.EDIT,
            FlowMakerCapability.RUN
        )
    }

    addCapabilities(...capability: symbol[]) {
        this.role.capabilities.push(...capability)
        return this
    }

    build() {
        return this.role
    }
}
