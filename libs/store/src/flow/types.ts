/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { ActivityStreamItem, TriggerParams } from "../gbc"

export enum FlowType {
    REGULAR = "regular",
    INTEGRATION = "integration"
}

export type FlowBranch = {
    flowIndex: number
    trigger: Omit<TriggerParams, "action">
}
export type FlowBase = {
    name: string
    description?: string
    repeat?: number
    restricted?: boolean
    branches: FlowBranch[]
}
export type FlowRegular = FlowBase & {
    type: FlowType.REGULAR
    activities: ActivityStreamItem[]
}
export type FlowIntegration = FlowBase & {
    type: FlowType.INTEGRATION
    endpoint: string
}
export type Flow = FlowRegular | FlowIntegration
