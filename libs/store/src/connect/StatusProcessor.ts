/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { updateMachineCommandMsg, updateMachineControlWordMsg } from "../machine/machine_api"
import { useEffect, useRef, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { machineSlice, MachineSliceType } from "../machine"
import { RootState } from "../root"
import { StreamHandler, streamSlice, StreamSliceType, updateStreamCommandMsg } from "../stream"
import { kinematicsSlice } from "../kinematics"
import { traceSlice } from "../trace"
import { framesSlice } from "../frames"
import { telemetrySlice } from "../telemetry"
import { GbcConstants, STREAMCOMMAND, STREAMSTATE } from "../gbc"
import { GlowbuzzerStatus } from "../gbc_extra"
import { tasksSlice } from "../tasks"
import { activitySlice } from "../activity"
import { jointsSlice } from "../joints"
import { digitalInputsSlice, safetyDigitalInputsSlice } from "../io/din"
import { digitalOutputsSlice } from "../io/dout"
import { analogInputsSlice } from "../io/ain"
import { analogOutputsSlice } from "../io/aout"
import { integerInputsSlice, unsignedIntegerInputsSlice } from "../io/iin"
import { integerOutputsSlice, unsignedIntegerOutputsSlice } from "../io/iout"
import { useBusCycleTime, useConfigVersion, useHeartbeatTimeout } from "../config"
import { emstatSlice } from "../emstat"

function status(status, heartbeat) {
    return {
        status,
        heartbeat
    }
}

/**
 * This hook handles status messages from GBC and updates the redux store. It also handles
 * startup behaviour on initial connection to GBC and the transition of GBC into the desired
 * state in the state machine.
 */
export function useStatusProcessor(connection: WebSocket) {
    const [handledInitialTick, setHandledInitialTick] = useState(false)

    const configVersion = useConfigVersion()
    const heartbeatTimeout = useHeartbeatTimeout()
    const busCycleTime = useBusCycleTime()
    const dispatch = useDispatch()
    const machine: MachineSliceType = useSelector(({ machine }) => machine, shallowEqual)
    const { target, heartbeat, nextControlWord, currentState } = machine
    const streams = useSelector<RootState, StreamSliceType[]>(state => state.stream, shallowEqual)

    // we need to track if we've already done initial connection handling
    const newConnection = useRef(true)
    const lastHeartbeat = useRef(0)

    useEffect(() => {
        setHandledInitialTick(false)
        newConnection.current = true
    }, [connection, configVersion])

    useEffect(() => {
        if (
            !connection ||
            handledInitialTick ||
            !target ||
            !newConnection.current ||
            connection.readyState !== WebSocket.OPEN
        ) {
            return
        }

        // function safe_send(msg) {
        //     if (connection.readyState === WebSocket.OPEN) {
        //         connection.send(msg)
        //     }
        // }

        // we test if the tick count is non-zero, because we only want to do initial connection
        // handling after we've received our first status message, as this populates the store with
        // things like the number of kinematics configurations, streams, and so on
        // if (tick === 1 && newConnection.current) {
        newConnection.current = false

        dispatch(traceSlice.actions.reset(0)) // clear tool path on connect
        dispatch(framesSlice.actions.setActiveFrame(0)) // set active frame (equivalent to G54)
        dispatch(telemetrySlice.actions.init()) // reset telemetry

        dispatch(machineSlice.actions.init(target)) // reset machine state, using current target from GBC

        if (nextControlWord !== undefined) {
            // logic wants to dictate new control word to GBC
            connection.send(updateMachineControlWordMsg(nextControlWord))
        }

        // get a quick heartbeat over to GBC so it knows we are connected
        connection.send(
            updateMachineCommandMsg({
                heartbeat // echo the machine status heartbeat
            })
        )
        lastHeartbeat.current = heartbeat

        setHandledInitialTick(true)
        // }
        // end of initial connection handling
    }, [connection, target, handledInitialTick])

    useEffect(() => {
        if (!connection) {
            return
        }

        function safe_send(msg) {
            if (connection.readyState === WebSocket.OPEN) {
                connection.send(msg)
            }
        }

        for (const [streamIndex, stream] of streams.entries()) {
            if (stream.state === STREAMSTATE.STREAMSTATE_PAUSED_BY_ACTIVITY) {
                // stream is paused by activity so immediately set it to paused from client side
                safe_send(updateStreamCommandMsg(streamIndex, STREAMCOMMAND.STREAMCOMMAND_PAUSE))
            }

            // update buffered streams with latest from GBC, which may trigger more items
            // to be sent from the queue (if there is capacity)
            StreamHandler.update(dispatch, streamIndex, stream, currentState, items => {
                safe_send(
                    JSON.stringify({
                        stream: { streamIndex, items }
                    })
                )
            })
        }

        const heartbeat_frequency_ms =
            heartbeatTimeout || GbcConstants.DEFAULT_HLC_HEARTBEAT_TOLERANCE

        // send heartbeat twice as often as required to allow for delays
        const heartbeat_frequency = heartbeat_frequency_ms / busCycleTime / 2
        if (!lastHeartbeat.current || heartbeat > lastHeartbeat.current + heartbeat_frequency) {
            safe_send(
                updateMachineCommandMsg({ heartbeat /* echo the machine status heartbeat */ })
            )
            lastHeartbeat.current = heartbeat
        }
    }, [heartbeat, connection])

    useEffect(() => {
        if (
            nextControlWord !== undefined &&
            connection &&
            connection.readyState === WebSocket.OPEN
        ) {
            // logic wants to dictate new control word to GBC
            connection.send(updateMachineControlWordMsg(nextControlWord))
        }
    }, [nextControlWord])

    return function (msg: GlowbuzzerStatus) {
        // fan out parts of the status message to the appropriate slice
        if (msg.status) {
            const heartbeat = msg.status.machine.heartbeat
            msg.status.machine && dispatch(machineSlice.actions.status(msg.status.machine))
            msg.status.tasks && dispatch(tasksSlice.actions.status(msg.status.tasks))
            msg.status.activity && dispatch(activitySlice.actions.status(msg.status.activity))
            msg.status.joint && dispatch(jointsSlice.actions.status(msg.status.joint))
            msg.status.din &&
                dispatch(digitalInputsSlice.actions.status(status(msg.status.din, heartbeat)))
            msg.status.safetyDin &&
                dispatch(
                    safetyDigitalInputsSlice.actions.status(status(msg.status.safetyDin, heartbeat))
                )
            msg.status.dout &&
                dispatch(digitalOutputsSlice.actions.status(status(msg.status.dout, heartbeat)))
            msg.status.ain &&
                dispatch(analogInputsSlice.actions.status(status(msg.status.ain, heartbeat)))
            msg.status.aout &&
                dispatch(analogOutputsSlice.actions.status(status(msg.status.aout, heartbeat)))
            msg.status.iin &&
                dispatch(integerInputsSlice.actions.status(status(msg.status.iin, heartbeat)))
            msg.status.uiin &&
                dispatch(
                    unsignedIntegerInputsSlice.actions.status(status(msg.status.uiin, heartbeat))
                )
            msg.status.iout &&
                dispatch(integerOutputsSlice.actions.status(status(msg.status.iout, heartbeat)))
            msg.status.uiout &&
                dispatch(
                    unsignedIntegerOutputsSlice.actions.status(status(msg.status.uiout, heartbeat))
                )
            msg.status.kc && dispatch(kinematicsSlice.actions.status(msg.status.kc))
            msg.status.kc && dispatch(traceSlice.actions.status(msg.status.kc))
        }

        // these might be sent at different frequencies by GBC
        msg.stream && dispatch(streamSlice.actions.status(msg.stream))
        msg.telemetry && dispatch(telemetrySlice.actions.data(msg.telemetry))
        msg.emstat && dispatch(emstatSlice.actions.status(msg.emstat))
    }
}
