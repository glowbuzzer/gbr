/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TelemetryEntry } from "@glowbuzzer/store"

export type TelemetrySeries = {
    key: string
    colourIndex: number
    secondary?: boolean
    value(entry: TelemetryEntry, index: number, arr: TelemetryEntry[]): number
}
