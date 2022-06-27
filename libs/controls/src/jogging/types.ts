/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

export type WaypointsProps = {
    kinematicsConfigurationIndex: number
    onSelect(waypoint: number[]): void
}

export enum JogDirection {
    POSITIVE,
    NEGATIVE
}

export enum JogMode {
    CONTINUOUS,
    STEP,
    GOTO
}
