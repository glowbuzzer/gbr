/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { CaseReducer, createSlice, PayloadAction, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import {
    DesiredState,
    determine_machine_state,
    handleMachineState,
    MachineState
} from "./MachineStateHandler"
import { useConnection } from "../connect"
import { updateMachineControlWordMsg, updateMachineTargetMsg } from "./machine_api"
import { GlowbuzzerConfig, GlowbuzzerMachineStatus, MACHINETARGET, OPERATION_ERROR } from "../gbc"
import { useConfig } from "../config"
import { RootState } from "../root"
import { useCallback, useEffect, useMemo } from "react"

function shallowEqualCustom(objA: any, objB: any) {
    if (objA === objB) return true

    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
        return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    for (let i = 0; i < keysA.length; i++) {
        if (
            // !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
            !(objA[keysA[i]] === objB[keysA[i]])
        ) {
            return false
        }
    }

    return true
}

// this is transitory app state
type MachineStateHandling = {
    currentState?: MachineState
    desiredState: DesiredState
    nextControlWord?: number
    requestedTarget: MACHINETARGET
    heartbeatReceived?: boolean
}

export type MachineSliceType = GlowbuzzerMachineStatus & MachineStateHandling

const INITIAL_STATE = {
    requestedTarget: MACHINETARGET.MACHINETARGET_SIMULATION,
    target: undefined,
    desiredState: DesiredState.NONE,
    heartbeatReceived: true
} as MachineSliceType

export const machineSlice: Slice<
    MachineSliceType,
    {
        init: CaseReducer<MachineSliceType, PayloadAction<MACHINETARGET>>
        status: CaseReducer<MachineSliceType, PayloadAction<GlowbuzzerMachineStatus>>
        setRequestedTarget: CaseReducer<MachineSliceType, PayloadAction<MACHINETARGET>>
        setDesiredState: CaseReducer<MachineSliceType, PayloadAction<DesiredState>>
    }
> = createSlice({
    name: "machine",
    initialState: INITIAL_STATE,
    reducers: {
        init: (_state, action) => ({ ...INITIAL_STATE, requestedTarget: action.payload }),
        status: (state, action) => {
            // called with status.machine from the json every time GBC sends status message
            const {
                statusWord,
                controlWord,
                activeFault,
                faultHistory,
                target,
                targetConnectRetryCnt,
                operationError,
                operationErrorMessage
            } = action.payload

            state.statusWord = statusWord
            state.controlWord = controlWord
            state.activeFault = activeFault
            state.faultHistory = faultHistory
            state.target = target
            state.targetConnectRetryCnt = targetConnectRetryCnt
            state.operationError = operationError || OPERATION_ERROR.OPERATION_ERROR_NONE
            state.operationErrorMessage = operationErrorMessage

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
            state.target = MACHINETARGET.MACHINETARGET_NONE // set to none until we get update
            state.requestedTarget = action.payload
        },
        setDesiredState: (state, action) => {
            state.desiredState = action.payload
        }
    }
})

/** Returns the current machine state using the CiA 402 state machine codes. */
export function useMachineState(): MachineState {
    return useSelector<RootState, MachineState>(state => state.machine.currentState)
}

export function useMachineConfig(): GlowbuzzerConfig["machine"][0] {
    return useSelector<RootState, GlowbuzzerConfig["machine"][0]>(
        state => state.config.current.machine?.[0] || {}
    )
}

/**
 * @deprecated For performance reasons, use the more specific hooks available
 */
export function useMachine(): {
    /** The name of the machine */
    name: string
    /** Indicates if a processing error has occurred. */
    operationError?: OPERATION_ERROR
    /** The error message if an error has occurred. */
    operationErrorMessage?: string
    /** The current CIA 402 status word */
    statusWord?: number
    /** The CIA 402 control word sent */
    controlWord?: number
    /** The active fault, a bitwise union of {@link FAULT_CAUSE}. Populated if machine state is `FAULT_REACTION_ACTIVE` */
    activeFault?: number
    /** The last registered fault prior to fault reset, a bitwise union of {@link FAULT_CAUSE} */
    faultHistory?: number
    /** The requested backend target, simulation of fieldbus */
    requestedTarget?: MACHINETARGET
    /** The current backend target. Can be different to the requested target if the machine is in the process of switching targets */
    target?: MACHINETARGET
    /** The number of times connection to the requested target has been attempted */
    targetConnectRetryCnt?: number
    /** Incrementing integer heartbeat */
    heartbeat?: number
    /** Indicates if the heartbeat is being received in a timely manner */
    heartbeatReceived?: boolean
    /** Current CIA 402 machine state */
    currentState?: MachineState
    /** Whether the desired state of the machine is operational (enabled) or standby (disabled) */
    desiredState: DesiredState
    /** @ignore */
    nextControlWord?: number
    /** Sets the desired backend target */
    setDesiredMachineTarget(target: MACHINETARGET): void
    /** Sets the desired machine state, operational (enabled) or standby (disabled) */
    setDesiredState(state: DesiredState): void
    /** Sets the low level CIA 402 machine control word */
    setMachineControlWord(controlWord: number): void
} {
    const machine: MachineSliceType = useSelector(({ machine }) => machine, shallowEqualCustom)
    const config = useConfig()

    useEffect(() => {
        console.log("Machine changed!")
    }, [machine])

    // this is our hook giving access to the underlying websocket connection
    const connection = useConnection()

    // this is redux hook
    const dispatch = useDispatch()

    return {
        ...machine,
        name: config?.machine?.[0]?.name,
        setDesiredMachineTarget(target: MACHINETARGET) {
            dispatch(machineSlice.actions.setRequestedTarget(target))
            // dispatch(() => {
            connection.send(updateMachineTargetMsg(target))
            // })
        },
        setDesiredState(state: DesiredState) {
            dispatch(machineSlice.actions.setDesiredState(state))
        },
        setMachineControlWord(controlWord: number) {
            // dispatch(() => {
            connection.send(updateMachineControlWordMsg(controlWord))
            // })
        }
    }
}

export function useMachineHeartbeat(): number {
    return useSelector<RootState, number>(state => state.machine.heartbeat)
}

export function useMachineControlWord(): [number, (controlWord: number) => void] {
    const connection = useConnection()
    const controlWord = useSelector<RootState, number>(state => state.machine.controlWord)

    const setControlWord = useCallback(
        (controlWord: number) => {
            connection.send(updateMachineControlWordMsg(controlWord))
        },
        [connection]
    )

    return [controlWord, setControlWord]
}

export function useMachineTargetState(): [
    current: MACHINETARGET,
    requested: MACHINETARGET,
    change: (target: MACHINETARGET) => void
] {
    const connection = useConnection()
    const target = useSelector<RootState, MACHINETARGET>(state => state.machine.target)
    const requestedTarget = useSelector<RootState, MACHINETARGET>(
        state => state.machine.requestedTarget
    )

    const dispatch = useDispatch()

    return useMemo(
        () => [
            target,
            requestedTarget,
            (target: MACHINETARGET) => {
                connection.send(updateMachineTargetMsg(target))
                dispatch(machineSlice.actions.setRequestedTarget(target))
            }
        ],
        [connection, target, requestedTarget, dispatch]
    )
}

export function useMachineTargetAcquired(): boolean {
    return useSelector<RootState, boolean>(
        state => state.machine.requestedTarget === state.machine.target
    )
}

export function useMachineCurrentState(): MachineState {
    return useSelector<RootState, MachineState>(state => state.machine.currentState)
}

export function useMachineDesiredState(): [DesiredState, (state: DesiredState) => void] {
    const dispatch = useDispatch()
    const current = useSelector<RootState, DesiredState>(state => state.machine.desiredState)

    return useMemo(
        () => [
            current,
            (state: DesiredState) => {
                dispatch(machineSlice.actions.setDesiredState(state))
            }
        ],
        [dispatch, current]
    )
}

export function useMachineFaults() {
    return useSelector<
        RootState,
        Pick<
            MachineSliceType,
            "faultHistory" | "activeFault" | "operationError" | "operationErrorMessage"
        >
    >(state => {
        const { activeFault, faultHistory, operationError, operationErrorMessage } = state.machine
        return {
            activeFault,
            faultHistory,
            operationError,
            operationErrorMessage
        }
    }, shallowEqual)
}

export {
    MachineState,
    DesiredState,
    determine_machine_state,
    possible_transitions
} from "./MachineStateHandler"
