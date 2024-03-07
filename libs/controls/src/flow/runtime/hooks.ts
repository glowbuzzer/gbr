/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    Flow,
    STREAMCOMMAND,
    STREAMSTATE,
    useAnalogInputs,
    useConnection,
    useDigitalInputs,
    useExternalIntegerInputs,
    useExternalUnsignedIntegerInputs,
    useFlows,
    useIntegerInputs,
    useMachine,
    useMachineConfig,
    useSafetyDigitalInputs,
    useStream,
    useUnsignedIntegerInputs
} from "@glowbuzzer/store"
import { useEffect, useMemo, useState } from "react"
import { ClientSideTrigger, triggerFactory } from "./triggers"
import { FlowState, MachineStateAll } from "./types"

function useFlowTriggerInputsState(): MachineStateAll {
    const digitalInputs = useDigitalInputs()
    const safetyDigitalInputs = useSafetyDigitalInputs()
    const analogInputs = useAnalogInputs()
    const integerInputs = useIntegerInputs()
    const unsignedIntegerInputs = useUnsignedIntegerInputs()
    const externalIntegerInputs = useExternalIntegerInputs()
    const externalUnsignedIntegerInputs = useExternalUnsignedIntegerInputs()
    const { heartbeat } = useMachine()

    return useMemo(
        () => ({
            analogInputs,
            digitalInputs,
            safetyDigitalInputs,
            integerInputs,
            unsignedIntegerInputs,
            externalIntegerInputs,
            externalUnsignedIntegerInputs,
            heartbeat
        }),
        [
            analogInputs,
            digitalInputs,
            safetyDigitalInputs,
            integerInputs,
            unsignedIntegerInputs,
            externalIntegerInputs,
            externalUnsignedIntegerInputs,
            heartbeat
        ]
    )
}

type FlowRuntimeReturn = {
    activeFlow: Flow
    state: FlowState
    start?: () => void
    stop?: () => void
    pause?: () => void
    reset?: () => void
}

export function useFlowRuntime2(selectedFlowIndex: number): FlowRuntimeReturn {
    const flows = useFlows()
    const { state: stream_state, execute, sendCommand, tag, reset } = useStream(0)
    const { busCycleTime } = useMachineConfig()
    const input_state = useFlowTriggerInputsState()
    const { connected } = useConnection()

    const [activeFlow, setActiveFlow] = useState<Flow>(null)
    const [triggerNextFlow, setTriggerNextFlow] = useState(false)
    const [triggersPaused, setTriggersPaused] = useState(false)
    const [triggers, setTriggers] = useState<ClientSideTrigger[]>()

    const state = useMemo(() => {
        if (!connected) {
            return FlowState.OFFLINE
        }
        switch (stream_state) {
            case STREAMSTATE.STREAMSTATE_IDLE:
                return triggerNextFlow
                    ? triggersPaused
                        ? FlowState.PAUSED
                        : FlowState.WAITING
                    : FlowState.IDLE
            case STREAMSTATE.STREAMSTATE_ACTIVE:
                return FlowState.ACTIVE
            case STREAMSTATE.STREAMSTATE_PAUSED:
                return FlowState.PAUSED
            case STREAMSTATE.STREAMSTATE_STOPPING:
                return FlowState.STOPPING
            case STREAMSTATE.STREAMSTATE_STOPPED:
                return FlowState.STOPPED
            default:
                return FlowState.OFFLINE
        }
    }, [connected, stream_state, activeFlow, triggerNextFlow])

    function exec(flow: Flow) {
        execute(api => flow.activities.map(activity => api.from(activity)))
            .then(() => {
                console.log("FLOW ENDED", flow.name, "BRANCHES", flow.branches.length)
                if (flow.branches?.length) {
                    setTriggerNextFlow(true)
                }
            })
            .catch(() => {
                console.log("EXCEPTION RECEIVED")
                setActiveFlow(null)
            })
    }

    useEffect(() => {
        if (activeFlow) {
            console.log("START FLOW", activeFlow.name)
            exec(activeFlow)
        }
    }, [activeFlow])

    // Note that this effect deliberately omits the dynamic machine (input) state, because we want to capture the state
    // at the time the flow ends, not when it subsequently changes.
    useEffect(() => {
        // console.log("CHECK FOR TRIGGER NEXT FLOW", activeFlow?.name, triggerNextFlow)
        if (activeFlow && triggerNextFlow) {
            // capture input states at the moment the flow ends
            // console.log("CAPTURE STATE AND INIT TRIGGERS")
            const triggers = activeFlow.branches.map(triggerFactory(input_state, busCycleTime))
            setTriggers(triggers)
        } else {
            setTriggers(null)
        }
    }, [activeFlow, triggerNextFlow])

    useEffect(() => {
        if (triggers && !triggersPaused) {
            // console.log("check triggers!")
            // find the first trigger that has fired
            const trigger = triggers.find(trigger => trigger.triggered(input_state))
            if (trigger) {
                console.log(
                    "TRIGGER NEXT FLOW!",
                    activeFlow.name,
                    "to",
                    flows[trigger.flowIndex].name,
                    triggers.length
                )
                setTriggerNextFlow(false)
                setActiveFlow(flows[trigger.flowIndex])
            }
        }
    }, [input_state, triggers, triggersPaused])

    const result: FlowRuntimeReturn = {
        activeFlow,
        state
    }

    const start_stream = () => {
        setActiveFlow(flows[selectedFlowIndex])
        setTriggerNextFlow(false)
    }
    const resume_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
    const pause_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_PAUSE)
    const pause_triggers = () => setTriggersPaused(true)
    const resume_triggers = () => setTriggersPaused(false)
    const stop_stream = () => sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
    const stop_triggers = () => {
        setActiveFlow(null)
        setTriggerNextFlow(false)
    }

    switch (state) {
        case FlowState.IDLE:
            result.start = start_stream
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
        case FlowState.WAITING:
            result.stop = stop_triggers
            result.pause = pause_triggers
            break
        case FlowState.STOPPING:
            break
        case FlowState.STOPPED:
            result.reset = () => {
                reset()
                sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
            }
            break
    }
    return result
}
