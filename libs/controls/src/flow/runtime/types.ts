/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { STREAMSTATE } from "@glowbuzzer/store"

export type MachineInputsState = {
    analogInputs: number[]
    digitalInputs: boolean[]
    safetyDigitalInputs: boolean[]
    integerInputs: number[]
    unsignedIntegerInputs: number[]
    externalIntegerInputs: number[]
    externalUnsignedIntegerInputs: number[]
    heartbeat: number
}

/**
 * An overlay of the stream state and a state where we are between flows and waiting for next trigger
 */
export enum FlowState {
    IDLE = STREAMSTATE.STREAMSTATE_IDLE,
    ACTIVE = STREAMSTATE.STREAMSTATE_ACTIVE,
    PAUSED = STREAMSTATE.STREAMSTATE_PAUSED,
    STOPPING = STREAMSTATE.STREAMSTATE_STOPPING,
    STOPPED = STREAMSTATE.STREAMSTATE_STOPPED,
    WAITING = 98,
    OFFLINE = 99
}
