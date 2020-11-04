/* eslint-disable no-mixed-operators */

export enum MachineState {
    UNKNOWN = "UNKNOWN",
    FAULT_REACTION_ACTIVE = "FAULT_REACTION_ACTIVE",
    FAULT = "FAULT",
    NOT_READY_TO_SWITCH_ON = "NOT_READY_TO_SWITCH_ON",
    SWITCH_ON_DISABLED = "SWITCH_ON_DISABLED", // this actually means it can be switched on!!!
    READY_TO_SWITCH_ON = "READY_TO_SWITCH_ON",
    SWITCHED_ON = "SWITCHED_ON",
    OPERATION_ENABLED = "OPERATION_ENABLED",
    QUICK_STOP = "QUICK_STOP"
}

export enum DesiredState {
    NONE = "NONE",
    OPERATIONAL = "OPERATIONAL",
    STANDBY = "STANDBY"
}

export function determine_machine_state(status: number): MachineState {
    if (status & 0b1000) {
        return (status & 0b1111) === 0b1111 ? MachineState.FAULT_REACTION_ACTIVE : MachineState.FAULT
    }

    if ((status & 0b01001111) === 0b01000000) {
        return MachineState.SWITCH_ON_DISABLED
    }

    switch (status & 0b100111) {
        case 0b100001:
            return MachineState.READY_TO_SWITCH_ON
        case 0b100011:
            return MachineState.SWITCHED_ON
        case 0b100111:
            return MachineState.OPERATION_ENABLED
        case 0b000111:
            return MachineState.QUICK_STOP
    }
    return MachineState.UNKNOWN
}

// noinspection JSUnusedGlobalSymbols
export const possible_transitions = {
    FaultSet: () => 0b01000000,
    FaultClear: c => c & 0b10111111,
    FaultReset: () => 0b10000000,
    Shutdown: c => (c & 0b01111000) | 0b0110,
    DisableVoltage: c => c & ~0b0010,
    SwitchOn: c => (c & 0b01110000) | 0b0111,
    EnableOperation: c => (c & 0b01100000) | 0b1111,
    QuickStop: c => (c & 0b01101011) | 0b1011 // do we need to force any bits here?
}

export function handleMachineState(currentState: MachineState, controlWord: number, desiredState: DesiredState): number | void {
    const state = currentState

    if (
        desiredState === DesiredState.NONE ||
        (desiredState === DesiredState.OPERATIONAL && state === MachineState.OPERATION_ENABLED) ||
        (desiredState === DesiredState.STANDBY && state === MachineState.SWITCH_ON_DISABLED)
    ) {
        // console.log("ALREADY IN DESIRED STATE - CURRENT", state, "DESIRED", desiredState)
        return
    }

    if (desiredState === DesiredState.OPERATIONAL) {
        // console.log("HANDLE MACHINE STATE - OPERATION ENABLED - CURRENT", state)

        switch (state) {
            case MachineState.UNKNOWN:
            case MachineState.FAULT_REACTION_ACTIVE:
            case MachineState.FAULT:
            case MachineState.NOT_READY_TO_SWITCH_ON:
            case MachineState.OPERATION_ENABLED:
            case MachineState.QUICK_STOP:
                break
            case MachineState.SWITCH_ON_DISABLED:
                // console.log("TRANSITION SHUTDOWN")
                return possible_transitions.Shutdown(controlWord)
            case MachineState.READY_TO_SWITCH_ON:
                // console.log("TRANSITION SWITCH ON")
                return possible_transitions.SwitchOn(controlWord)
            case MachineState.SWITCHED_ON:
                // console.log("TRANSITION ENABLE")
                return possible_transitions.EnableOperation(controlWord)
        }
    } else {
        // console.log("HANDLE MACHINE STATE - STANDBY - CURRENT", state, "DESIRED", desiredState)
        switch (state) {
            case MachineState.UNKNOWN:
            case MachineState.FAULT_REACTION_ACTIVE:
            case MachineState.FAULT:
            case MachineState.NOT_READY_TO_SWITCH_ON:
            case MachineState.SWITCH_ON_DISABLED:
                break
            case MachineState.OPERATION_ENABLED:
            case MachineState.QUICK_STOP:
            case MachineState.SWITCHED_ON:
            case MachineState.READY_TO_SWITCH_ON:
                return possible_transitions.DisableVoltage(controlWord)
        }
    }
}
