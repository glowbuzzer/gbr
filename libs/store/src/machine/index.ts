import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { DesiredState, determine_machine_state, handleMachineState, MachineState } from "./MachineStateHandler"
import { RootState } from "../root"
import { useConnect } from "../connect"

export enum MachineTarget {
    NONE,
    FIELDBUS,
    SIMULATION
}

export enum FaultCode {
    FAULT_CAUSE_ESTOP = 1 << 0,
    FAULT_CAUSE_DRIVE_FAULT = 1 << 1,
    FAULT_CAUSE_GBC_FAULT_REQUEST = 1 << 2,
    FAULT_CAUSE_HEARTBEAT_LOST = 1 << 3,
    FAULT_CAUSE_LIMIT_REACHED = 1 << 4,
    FAULT_CAUSE_DRIVE_STATE_CHANGE_TIMEOUT = 1 << 5,
    FAULT_CAUSE_DRIVE_FOLLOW_ERROR = 1 << 6,
    FAULT_CAUSE_DRIVE_NO_REMOTE = 1 << 7,
    FAULT_CAUSE_ECAT = 1 << 8,
    FAULT_CAUSE_DRIVE_ALARM = 1 << 9
}

// this is the data coming back from board in status.machine
type MachineStatus = {
    statusWord: number
    controlWord: number
    activeFault: number
    requestedTarget: MachineTarget
    actualTarget: MachineTarget
    heartbeat?: number
    heartbeatReceived: boolean
}

// this is transitory app state
type MachineStateHandling = {
    currentState: MachineState
    desiredState: DesiredState
    nextControlWord: number | void
}

export function updateMachineCommandMsg(command) {
    return JSON.stringify({
        command: {
            machine: {
                0: {
                    command
                }
            }
        }
    })
}

export function updateMachineTargetMsg(target: MachineTarget) {
    return updateMachineCommandMsg({ target })
}

export function updateMachineControlWordMsg(controlWord: number) {
    return updateMachineCommandMsg({ controlWord })
}

// createSlice adds a top-level object to the app state and lets us define the initial state and reducers (actions) on it
export const machineSlice = createSlice({
    name: "machine",
    initialState: {
        requestedTarget: MachineTarget.SIMULATION,
        actualTarget: undefined,
        desiredState: DesiredState.OPERATIONAL,
        heartbeatReceived: true
    } as MachineStatus & MachineStateHandling,
    reducers: {
        status: (state, action) => {
            // called with status.machine from the json every time board sends status message
            const { statusWord, controlWord, activeFault, target } = action.payload
            state.statusWord = statusWord
            state.controlWord = controlWord
            state.activeFault = activeFault
            state.actualTarget = target

            // check if the heartbeat has changed
            state.heartbeatReceived = state.heartbeat !== action.payload.heartbeat // any change signals healthy heartbeat
            state.heartbeat = action.payload.heartbeat

            // set the next machine state to be sent (handled in connect/index.ts)
            state.currentState = determine_machine_state(state.statusWord)
            state.nextControlWord = handleMachineState(state.currentState, state.controlWord, state.desiredState)
            if (!state.nextControlWord) {
                state.desiredState = DesiredState.NONE
            }
        },
        setDesiredState: (state, action) => {
            console.log("SET DESIRED STATE", action.payload)
            state.desiredState = action.payload
        }
    }
})

export const useMachine = () => {
    // by using a selector, components using this hook will only render when machine state changes (not the whole state)
    const machine = useSelector(({ machine }: RootState) => machine, shallowEqual)

    // this is our hook giving access to the underlying websocket connection
    const connection = useConnect()

    // this is redux hook
    const dispatch = useDispatch()

    return {
        ...machine,
        setDesiredMachineTarget(target: MachineTarget) {
            dispatch(dispatch => {
                connection.send(updateMachineTargetMsg(target))
            })
        },
        setDesiredState(state: DesiredState) {
            dispatch(machineSlice.actions.setDesiredState(state))
        },
        setMachineControlWord(controlWord: number) {
            dispatch(dispatch => {
                connection.send(updateMachineControlWordMsg(controlWord))
            })
        }
    }
}

export { MachineState, DesiredState, determine_machine_state, possible_transitions } from "./MachineStateHandler"
