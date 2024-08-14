/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useUser } from "./UserProvider"
import { DisabledContextProvider } from "antd/es/config-provider/DisabledContext"

type UserCapabilityRegionProps = {
    capability: symbol | symbol[]
    children: React.ReactNode
} & (
    | {
          alternative?: React.ReactNode
          disableOnly?: never
      }
    | {
          alternative?: never
          disableOnly?: true
      }
)

function has_capability(capability: symbol | symbol[], capabilities: symbol[]) {
    if (Array.isArray(capability)) {
        return capability.some(c => capabilities.includes(c))
    } else {
        return capabilities.includes(capability)
    }
}

export const UserCapabilityGuard = ({
    capability,
    alternative = null,
    disableOnly,
    children
}: UserCapabilityRegionProps) => {
    const { enabled, capabilities } = useUser()

    const allowed = !enabled || has_capability(capability, capabilities)

    if (disableOnly) {
        return <DisabledContextProvider disabled={!allowed}>{children}</DisabledContextProvider>
    }

    return allowed ? children : alternative
}
