/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    updateMachineCommandMsg,
    updateMachineControlWordMsg,
    updateMachineTargetMsg
} from "../machine/machine_api"
import { useEffect, useRef, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { machineSlice, MachineSliceType } from "../machine"
import { RootState } from "../root"
import { StreamHandler, streamSlice, StreamSliceType, updateStreamCommandMsg } from "../stream"
import { kinematicsSlice, updateFroMsg, useKinematicsList } from "../kinematics"
import { traceSlice } from "../trace"
import { framesSlice } from "../frames"
import { telemetrySlice } from "../telemetry"
import { STREAMCOMMAND, STREAMSTATE } from "../gbc"
import { GlowbuzzerStatus } from "../gbc_extra"
import { tasksSlice } from "../tasks"
import { activitySlice } from "../activity"
import { jointsSlice } from "../joints"
import { digitalInputsSlice } from "../io/din"
import { digitalOutputsSlice } from "../io/dout"
import { analogInputsSlice } from "../io/ain"
import { analogOutputsSlice } from "../io/aout"
import { integerInputsSlice } from "../io/iin"
import { integerOutputsSlice } from "../io/iout"

/**
 * This hook handles status messages from GBC and updates the redux store. It also handles
 * startup behaviour on initial connection to GBC and the transition of GBC into the desired
 * state in the state machine.
 */
export function useStatusProcessor(connection: WebSocket) {
    const [tick, setTick] = useState(0)

    const dispatch = useDispatch()
    const machine: MachineSliceType = useSelector(({ machine }) => machine, shallowEqual)
    const { target, requestedTarget, heartbeat, nextControlWord, currentState } = machine
    const streams = useSelector<RootState, StreamSliceType[]>(state => state.stream, shallowEqual)
    const kinematics = useKinematicsList()

    // we need to track if we've already done initial connection handling
    const newConnection = useRef(true)

    useEffect(() => {
        setTick(0)
        newConnection.current = true
    }, [connection])

    useEffect(() => {
        if (!connection) {
            return
        }

        function safe_send(msg) {
            if (connection.readyState === WebSocket.OPEN) {
                connection.send(msg)
            }
        }

        // we test if the tick count is non-zero, because we only want to do initial connection
        // handling after we've received our first status message, as this populates the store with
        // things like the number of kinematics configurations, streams, and so on
        if (tick && newConnection.current) {
            newConnection.current = false

            dispatch(traceSlice.actions.reset(0)) // clear tool path on connect
            dispatch(framesSlice.actions.setActiveFrame(0)) // set active frame (equivalent to G54)
            dispatch(telemetrySlice.actions.init()) // reset telemetry
            dispatch(machineSlice.actions.init()) // reset machine state

            if (target !== requestedTarget) {
                // we are not in the desired target state (sim/live) so send a message to GBC to change state
                safe_send(updateMachineTargetMsg(requestedTarget))
            }

            if (nextControlWord !== undefined) {
                // logic wants to dictate new control word to GBC
                safe_send(updateMachineControlWordMsg(nextControlWord))
            }

            // get a quick heartbeat over to GBC so it knows we are connected
            safe_send(
                updateMachineCommandMsg({
                    heartbeat // echo the machine status heartbeat
                })
            )

            for (const [n, { froTarget }] of kinematics.entries()) {
                if (froTarget === 0) {
                    // set fro to 100% if not already set on connect
                    safe_send(updateFroMsg(n, 1))
                }
            }
        }

        // end of initial connection handling
        // start of per-tick handling

        for (const [streamIndex, stream] of streams.entries()) {
            if (stream.state === STREAMSTATE.STREAMSTATE_PAUSED_BY_ACTIVITY) {
                // stream is paused by activity so immediately set it to paused from client side
                safe_send(updateStreamCommandMsg(streamIndex, STREAMCOMMAND.STREAMCOMMAND_PAUSE))
            }

            // update buffered streams with latest from GBC, which may trigger more items
            // to be send from the queue (if there is capacity)
            StreamHandler.update(dispatch, streamIndex, stream, currentState, items => {
                safe_send(
                    JSON.stringify({
                        stream: { streamIndex, items }
                    })
                )
            })
        }

        if (tick % 50 === 0) {
            // send heartbeat about every 5 seconds assuming status message is 10hz
            safe_send(
                updateMachineCommandMsg({
                    heartbeat // echo the machine status heartbeat
                })
            )
        }
    }, [connection, tick])

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
            msg.status.machine && dispatch(machineSlice.actions.status(msg.status.machine))
            msg.status.tasks && dispatch(tasksSlice.actions.status(msg.status.tasks))
            msg.status.activity && dispatch(activitySlice.actions.status(msg.status.activity))
            msg.status.joint && dispatch(jointsSlice.actions.status(msg.status.joint))
            msg.status.din && dispatch(digitalInputsSlice.actions.status(msg.status.din))
            msg.status.dout && dispatch(digitalOutputsSlice.actions.status(msg.status.dout))
            msg.status.ain && dispatch(analogInputsSlice.actions.status(msg.status.ain))
            msg.status.aout && dispatch(analogOutputsSlice.actions.status(msg.status.aout))
            msg.status.iin && dispatch(integerInputsSlice.actions.status(msg.status.iin))
            msg.status.iout && dispatch(integerOutputsSlice.actions.status(msg.status.iout))
            msg.status.kc && dispatch(kinematicsSlice.actions.status(msg.status.kc))
            msg.status.kc && dispatch(traceSlice.actions.status(msg.status.kc))
        }

        msg.stream && dispatch(streamSlice.actions.status(msg.stream))
        msg.telemetry && dispatch(telemetrySlice.actions.data(msg.telemetry))

        // increment tick count
        setTick(current => current + 1)
    }
}
