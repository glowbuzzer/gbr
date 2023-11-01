/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerStatus } from "../gbc_extra"

export enum TelemetryPVAT {
    POS = "p",
    VEL = "v",
    ACC = "a",
    TORQUE = "t"
}

export enum TelemetryVisibilityOptions {
    SET = 0b01,
    ACT = 0b10,
    BOTH = 0b11,
    DIFF = 0b100
}

export type TelemetrySettingsType = {
    captureDuration: number
    plot: TelemetryPVAT
}

export enum CaptureState {
    RUNNING,
    PAUSED,
    WAITING,
    CAPTURING,
    COMPLETE
}

export type TelemetryEntry = GlowbuzzerStatus["telemetry"][0]

export type TelemetryGenerator = (domain: [number, number?]) => IterableIterator<TelemetryEntry>

export type TelemetrySelector = (
    e: TelemetryEntry,
    index: number,
    view: TelemetryVisibilityOptions,
    plot: TelemetryPVAT
) => number[]

export type TelemetryDomainProvider = (
    jointIndex: number,
    plot: TelemetryPVAT,
    view: TelemetryVisibilityOptions
) => number[]
