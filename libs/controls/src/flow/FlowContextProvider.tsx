/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
    Flow,
    MachineState,
    STREAMCOMMAND,
    STREAMSTATE,
    useConnection,
    useFlows,
    useMachineConfig,
    useMachineState,
    useStream
} from "@glowbuzzer/store"
import { FlowState } from "./runtime/types"
import { ClientSideTrigger, triggerFactory } from "./runtime/triggers"
import { useFlowDerivedState, useFlowTriggerInputsState } from "./runtime/hooks"

type FlowContextType = {
    selectedFlowIndex: number
    setSelectedFlowIndex(index: number): void
    activeFlow: Flow
    completedFlows: Flow[]
    tag: number
    active: boolean
    state: FlowState
    start?: () => void
    stop?: () => void
    pause?: () => void
    reset?: () => void
    close?: () => void
}

const FlowContext = createContext<FlowContextType>(null)

export const FlowContextProvider = ({ children }) => {
    const flows = useFlows()
    const { state: stream_state, execute, sendCommand, tag, reset: stream_reset } = useStream(0)
    const { busCycleTime } = useMachineConfig()
    const { connected } = useConnection()
    const machine_state = useMachineState()
    const input_state = useFlowTriggerInputsState()

    const [selectedFlowIndex, setSelectedFlowIndex] = useState(0)
    const [activeFlow, setActiveFlow] = useState<Flow>(null)
    const [completedFlows, setCompletedFlows] = useState<Flow[]>([])
    const [iteration, setIteration] = useState(1)
    const [triggerNextFlow, setTriggerNextFlow] = useState(false)
    const [triggersPaused, setTriggersPaused] = useState(false)
    const [triggers, setTriggers] = useState<ClientSideTrigger[]>()
    const [error, setError] = useState(false)
    const [lastTag, setLastTag] = useState(0)

    const state = useFlowDerivedState(
        connected,
        stream_state,
        triggerNextFlow,
        triggersPaused,
        error
    )

    function reset(includeActiveFlow = false) {
        stream_reset()
        setTriggersPaused(false)
        setTriggerNextFlow(false)
        setTriggers(null)
        if (includeActiveFlow) {
            setActiveFlow(null)
        }
    }

    useEffect(() => {
        if (machine_state === MachineState.OPERATION_ENABLED && !error) {
            setLastTag(tag)
        }
    }, [tag, machine_state, error])

    useEffect(() => {
        if (!connected || machine_state !== MachineState.OPERATION_ENABLED) {
            // reset all
            reset(false)
        }
    }, [connected, machine_state])

    // start the active flow when it changes
    useEffect(() => {
        if (activeFlow) {
            reset()
            execute(api => activeFlow.activities.map(activity => api.from(activity)))
                .then(() => {
                    if (iteration < activeFlow.repeat) {
                        setIteration(current => current + 1)
                    } else {
                        setCompletedFlows(flows => [...flows, activeFlow])
                        if (activeFlow.branches?.length) {
                            setTriggerNextFlow(true)
                        } else {
                            // end of the line
                            reset(true)
                        }
                    }
                })
                .catch(() => {
                    setError(true)
                })
        }
    }, [activeFlow, iteration])

    // Note that this effect deliberately omits the dynamic machine (input) state, because we want to capture the state
    // at the time the flow ends, not when it subsequently changes.
    useEffect(() => {
        // console.log("CHECK FOR TRIGGER NEXT FLOW", activeFlow?.name, triggerNextFlow)
        if (activeFlow && triggerNextFlow) {
            // capture input states at the moment the flow ends
            // console.log("CAPTURE STATE AND INIT TRIGGERS")
            const triggers = activeFlow.branches.map(triggerFactory(input_state, busCycleTime))
            setTriggers(triggers)
            setLastTag(0) // reset the tag
        }
    }, [activeFlow, triggerNextFlow])

    useEffect(() => {
        if (triggers) {
            if (!triggersPaused) {
                // find the first trigger that has fired, if any
                const trigger = triggers.find(trigger => trigger.triggered(input_state))
                if (trigger) {
                    // console.log("TRIGGER NEXT FLOW", flows[trigger.flowIndex].name)
                    reset()
                    setActiveFlow(flows[trigger.flowIndex])
                }
            } else {
                triggers.forEach(trigger => trigger.handlePaused(input_state))
            }
        }
    }, [input_state, triggers, triggersPaused])

    // create some convenience functions for controlling the stream and other state
    const start_stream = () => {
        reset(false)
        setError(false)
        setIteration(1)
        setLastTag(0)
        setCompletedFlows([])
        setActiveFlow(flows[selectedFlowIndex])
    }

    const resume_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
    const pause_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_PAUSE)
    const pause_triggers = () => setTriggersPaused(true)
    const resume_triggers = () => setTriggersPaused(false)
    const stop_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
    const stop_triggers = () => {
        reset(true)
    }

    // by default no actions are available
    const active = !!activeFlow || completedFlows.length > 0
    const result: FlowContextType = {
        selectedFlowIndex,
        setSelectedFlowIndex,
        activeFlow,
        completedFlows,
        state,
        tag: lastTag,
        active
    }

    // determine which actions are available based on the current state
    switch (state) {
        case FlowState.ERROR:
            result.close = () => {
                reset(true)
                sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
                setCompletedFlows([])
                setError(false)
            }
            break
        case FlowState.IDLE:
            if (machine_state === MachineState.OPERATION_ENABLED && !error) {
                result.start = start_stream
            }
            if (!activeFlow || error) {
                result.close = () => {
                    reset(true)
                    setCompletedFlows([])
                }
            }
            break
        case FlowState.ACTIVE:
            if (stream_state === STREAMSTATE.STREAMSTATE_ACTIVE) {
                result.stop = stop_stream
                result.pause = pause_stream
            } else {
                result.pause = pause_triggers
                result.stop = stop_triggers
            }
            break
        case FlowState.PAUSED:
            if (stream_state === STREAMSTATE.STREAMSTATE_PAUSED) {
                result.start = resume_stream
                result.stop = stop_stream
            } else {
                result.start = resume_triggers
                result.stop = stop_triggers
            }
            break
        case FlowState.WAITING_ON_TRIGGER:
            result.stop = stop_triggers
            result.pause = pause_triggers
            break
        case FlowState.STOPPING:
            break
        case FlowState.STOPPED:
            // result.reset = reset_and_close
            result.close = () => {
                setCompletedFlows([])
                setActiveFlow(null)
                sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
            }
            break
    }

    return <FlowContext.Provider value={result}>{children}</FlowContext.Provider>
}

export function useFlowContext() {
    return useContext(FlowContext)
}
