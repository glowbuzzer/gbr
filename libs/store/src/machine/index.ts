import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { DesiredState, determine_machine_state, handleMachineState, MachineState } from "./MachineStateHandler"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { updateMachineControlWordMsg, updateMachineTargetMsg } from "./machine_api"
import { MACHINETARGET } from "../gbc"

// export enum MachineTarget {
//     NONE,
//     FIELDBUS,
//     SIMULATION
// }

// noinspection JSUnusedGlobalSymbols
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
    FAULT_CAUSE_GBC_TO_GBEM_CON_ERROR = 1 << 10,
    FAULT_CAUSE_DRIVE_MOOERROR = 1 << 11,
    FAULT_CAUSE_ECAT_SLAVE_ERROR = 1 << 12,
    FAULT_CAUSE_PLC_SIGNALLED_AN_ERROR = 1 << 13,
    FAULT_CAUSE_HOMING_ERROR = 1 << 14,
    FAULT_CAUSE_GBC_TO_PLC_CON_ERROR = 1 << 15,
    FAULT_CAUSE_GBC_ACTION_REQUESTED_WHEN_NOT_OP_EN = 1 << 16
}

// this is the data coming back from board in status.machine
type MachineStatus = {
    statusWord: number
    controlWord: number
    activeFault: number
    faultHistory: number
    requestedTarget: MACHINETARGET
    actualTarget: MACHINETARGET
    targetConnectRetryCnt: number
    heartbeat?: number
    heartbeatReceived: boolean
}

// this is transitory app state
type MachineStateHandling = {
    currentState: MachineState
    desiredState: DesiredState
    nextControlWord: number | void
}

type MachineSliceType = MachineStatus & MachineStateHandling

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
            const {
                statusWord,
                controlWord,
                activeFault,
                faultHistory,
                target,
                targetConnectRetryCnt
            } = action.payload
            state.statusWord = statusWord
            state.controlWord = controlWord
            state.activeFault = activeFault
            state.faultHistory = faultHistory
            state.actualTarget = target
            state.targetConnectRetryCnt = targetConnectRetryCnt

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
        setRequestedTarget: (state, action) => {
            state.actualTarget = MACHINETARGET.MACHINETARGET_NONE // set to none until we get update
            state.requestedTarget = action.payload
        },
        setDesiredState: (state, action) => {
            // console.log("SET DESIRED STATE", action.payload)
            state.desiredState = action.payload
        }
    }
})

/**
 * Returns the current status and methods to interact with the machine.
 *
 * The machine in GBC implements the CIA 402 state machine. The machine can be running in simulation mode or be connected to the
 * fieldbus for live operation. You can also request a desired machine state of operational (enabled) or standby (disabled),
 * and GBR will drive the CIA 402 state machine to `OPERATION_ENABLED` or `SWITCH_ON_DISABLED` accordingly. Faults are captured and exposed.
 * Finally, GBC increments a heartbeat on the machine so that GBR knows it is running.
 */
export function useMachine(): {
    /** The current CIA 402 status word */
    statusWord: number
    /** The CIA 402 control word sent */
    controlWord: number
    /** The active fault, a bitwise union of {@link FaultCode}. Populated if machine state is `FAULT_REACTION_ACTIVE` */
    activeFault: number
    /** The last registered fault prior to fault reset, a bitwise union of {@link FaultCode} */
    faultHistory: number
    /** The requested backend target, simulation of fieldbus */
    requestedTarget: MACHINETARGET
    /** The current backend target. Can be different to the requested target if the machine is in the process of switching targets */
    actualTarget: MACHINETARGET
    /** The number of times connection to the requested target has been attempted */
    targetConnectRetryCnt: number
    /** Incrementing integer heartbeat */
    heartbeat?: number
    /** Indicates if the heartbeat is being received in a timely manner */
    heartbeatReceived: boolean
    /** Current CIA 402 machine state */
    currentState: MachineState
    /** Whether the desired state of the machine is operational (enabled) or standby (disabled) */
    desiredState: DesiredState
    /** Sets the desired backend target */
    setDesiredMachineTarget(target: MACHINETARGET): void
    /** Sets the desired machine state, operational (enabled) or standby (disabled) */
    setDesiredState(state: DesiredState): void
    /** Sets the low level CIA 402 machine control word */
    setMachineControlWord(controlWord: number): void
} {
    // by using a selector, components using this hook will only render when machine state changes (not the whole state)
    const machine = useSelector(({ machine }: RootState) => machine, shallowEqual)

    // this is our hook giving access to the underlying websocket connection
    const connection = useConnection()

    // this is redux hook
    const dispatch = useDispatch()

    return {
        ...machine,
        setDesiredMachineTarget(target: MACHINETARGET) {
            dispatch(machineSlice.actions.setRequestedTarget(target))
            dispatch(() => {
                connection.send(updateMachineTargetMsg(target))
            })
        },
        setDesiredState(state: DesiredState) {
            dispatch(machineSlice.actions.setDesiredState(state))
        },
        setMachineControlWord(controlWord: number) {
            dispatch(() => {
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
