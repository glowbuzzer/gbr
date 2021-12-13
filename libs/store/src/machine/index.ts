import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { DesiredState, determine_machine_state, handleMachineState, MachineState } from "./MachineStateHandler"
import { RootState } from "../root"
import { useConnect } from "../connect"
import { updateMachineControlWordMsg, updateMachineTargetMsg } from "./machine_api"
import { MACHINETARGET } from "../gbc"

// export enum MachineTarget {
//     NONE,
//     FIELDBUS,
//     SIMULATION
// }

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
    FAULT_CAUSE_DRIVE_ALARM = 1 << 9,
    FAULT_CAUSE_GBC_TO_PLC_CON_ERROR = 1 << 10,
    FAULT_CAUSE_DRIVE_MOOERROR = 1 << 11,
    FAULT_CAUSE_ECAT_SLAVE_ERROR = 1 << 12
}

// this is the data coming back from board in status.machine
type MachineStatus = {
    statusWord: number
    controlWord: number
    activeFault: number
    faultHistory: number
    requestedTarget: MACHINETARGET
    actualTarget: MACHINETARGET
    heartbeat?: number
    heartbeatReceived: boolean
}

// this is transitory app state
type MachineStateHandling = {
    currentState: MachineState
    desiredState: DesiredState
    nextControlWord: number | void
}

type MachineSliceType = Partial<MachineStatus> & Partial<MachineStateHandling>

// createSlice adds a top-level object to the app state and lets us define the initial state and reducers (actions) on it
export const machineSlice: Slice<MachineSliceType> = createSlice({
    name: "machine",
    initialState: {
        requestedTarget: MACHINETARGET.MACHINETARGET_SIMULATION,
        actualTarget: undefined,
        desiredState: DesiredState.OPERATIONAL,
        heartbeatReceived: true
    } as MachineSliceType,
    reducers: {
        status: (state, action) => {
            // called with status.machine from the json every time board sends status message
            const { statusWord, controlWord, activeFault, faultHistory, target } = action.payload
            state.statusWord = statusWord
            state.controlWord = controlWord
            state.activeFault = activeFault
            state.faultHistory = faultHistory
            state.actualTarget = target

            // check if the heartbeat has changed
            state.heartbeatReceived = state.heartbeat !== action.payload.heartbeat // any change signals healthy heartbeat
            state.heartbeat = action.payload.heartbeat

            // set the next machine state to be sent (handled in connect/index.ts)
            state.currentState = determine_machine_state(state.statusWord)
            // console.log("state:" + state.currentState)
            state.nextControlWord = handleMachineState(
                state.currentState,
                state.controlWord,
                state.desiredState
            )
            // console.log("word:" + state.nextControlWord)
            if (state.nextControlWord === undefined) {
                state.desiredState = DesiredState.NONE
            }
        },
        setDesiredState: (state, action) => {
            // console.log("SET DESIRED STATE", action.payload)
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
        setDesiredMachineTarget(target: MACHINETARGET) {
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

export {
    MachineState,
    DesiredState,
    determine_machine_state,
    possible_transitions
} from "./MachineStateHandler"
