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
    Shutdown: () => 0b00000110,
    DisableVoltage: () => 0b00000000,
    SwitchOn: () => 0b00000111,
    EnableOperation: () => 0b00001111,
    QuickStop: () => 0b00000010
}

export function handleMachineState(currentState: MachineState, controlWord: number, desiredState: DesiredState): number | void {
    const state = currentState

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
                return possible_transitions.Shutdown()
            case MachineState.READY_TO_SWITCH_ON:
                // console.log("TRANSITION SWITCH ON")
                return possible_transitions.SwitchOn()
            case MachineState.SWITCHED_ON:
                // console.log("TRANSITION ENABLE")
                return possible_transitions.EnableOperation()
        }
    } else if (desiredState === DesiredState.STANDBY) {
        // console.log("HANDLE MACHINE STATE - STANDBY - CURRENT", state, "DESIRED", desiredState)
        switch (state) {
            case MachineState.SWITCH_ON_DISABLED:
                if (controlWord === possible_transitions.FaultReset()) {
                    // clear the fault reset command
                    return possible_transitions.DisableVoltage()
                }
                break
            case MachineState.UNKNOWN:
            case MachineState.FAULT_REACTION_ACTIVE:
            case MachineState.FAULT:
            case MachineState.NOT_READY_TO_SWITCH_ON:
                break
            case MachineState.OPERATION_ENABLED:
            case MachineState.QUICK_STOP:
            case MachineState.SWITCHED_ON:
            case MachineState.READY_TO_SWITCH_ON:
                return possible_transitions.DisableVoltage()
        }
    }
}
