/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { AppThunk, Connection } from "./Connection"
import { telemetrySlice } from "../telemetry"
import { machineSlice } from "../machine"
import { jointsSlice } from "../joints"
import { kinematicsSlice, updateFroMsg } from "../kinematics"
import { toolPathSlice } from "../toolpath"
import { gcodeSlice, updateStreamStateMsg } from "../gcode"
import { GCodeStreamer } from "../gcode/GCodeStreamer"
import { connectionSlice } from "./index"
import { configSlice, ConfigState } from "../config"
import { digitalInputsSlice } from "../io/din"
import { digitalOutputsSlice } from "../io/dout"
import { analogOutputsSlice } from "../io/aout"
import { integerOutputsSlice } from "../io/iout"
import { analogInputsSlice } from "../io/ain"
import { integerInputsSlice } from "../io/iin"
import { tasksSlice } from "../tasks"
import { activitySlice } from "../activity"
import {
    updateMachineCommandMsg,
    updateMachineControlWordMsg,
    updateMachineTargetMsg
} from "../machine/machine_api"
import { framesSlice } from "../frames"
import { STREAMCOMMAND, STREAMSTATE } from "../gbc"

/**
 * This class handles status messages from GBC and updates the redux store. It also handles
 * startup behaviour on initial connection to GBC and the transition of GBC into the desired
 * state in the state machine.
 */
class StatusProcessor {
    private first = true
    private tick: number

    process(msg, dispatch, ws, getState) {
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
        msg.status.kc && dispatch(toolPathSlice.actions.status(msg.status.kc))

        // this is after the status update on slices above, so state now has latest from GBC
        const { target, requestedTarget, nextControlWord, heartbeat } = getState().machine

        // do initial connection handling
        if (this.first) {
            this.first = false
            this.tick = 0

            dispatch(toolPathSlice.actions.reset(0)) // clear tool path on connect
            dispatch(framesSlice.actions.setActiveFrame(0)) // set active frame (equivalent to G54)

            if (target !== requestedTarget) {
                ws.send(updateMachineTargetMsg(requestedTarget))
            }
            if (msg.status.kc?.length) {
                // update current position within gcode slice with status
                dispatch(gcodeSlice.actions.init(msg.status.kc))

                const kinematics = getState().kinematics
                for (let n = 0; n < kinematics.length; n++) {
                    const { froTarget } = kinematics[n]
                    if (froTarget === 0) {
                        // set fro to 100% if not already set on connect
                        setTimeout(() => {
                            ws.send(updateFroMsg(n, 1))
                        }, 1000)
                    }
                }
            }
            dispatch(telemetrySlice.actions.init())
        }

        if (this.tick % 50 === 0) {
            // send heartbeat about every 5 seconds assuming status message is 10hz
            ws.send(
                updateMachineCommandMsg({
                    heartbeat // echo the machine status heartbeat
                })
            )
        }

        if (nextControlWord !== undefined) {
            // logic wants to dictate new control word to GBC
            ws.send(updateMachineControlWordMsg(nextControlWord))
        }

        this.tick++
    }
}

export type MessageResponse = {
    requestId?: string
    requestType: string
    [index: string]: any
} & ({ error: false } | { error: true; message: string })

class RequestResponseHandler {
    private requests: {
        [index: string]: {
            resolve: (value: MessageResponse) => void
            reject: (reason: any) => void
        }
    } = {}

    request(ws, requestType, args?): Promise<MessageResponse> {
        const requestId = Math.random().toString(36).substring(2, 15)
        return new Promise<MessageResponse>((resolve, reject) => {
            this.requests[requestId] = { resolve, reject }
            ws.send(
                JSON.stringify({
                    request: {
                        requestId,
                        requestType,
                        ...args
                    }
                })
            )
            setTimeout(() => {
                if (this.requests[requestId]) {
                    reject("Timeout waiting for response: " + requestId)
                }
            }, 5000)
        })
    }

    response(msg) {
        const { requestId, requestType, error, message, ...body } = msg
        if (!this.requests[requestId]) {
            // already resolved, ignore
            return
        }
        const { resolve, reject } = this.requests[requestId]
        delete this.requests[requestId]

        if (error) {
            reject(message)
        } else {
            resolve(body)
        }
    }
}

/**
 * This needs to be global on window, otherwise there is a circular dependency: connection -> actions -> useConnect -> connection
 */
if (typeof window !== "undefined") {
    window.connection = ((): Connection => {
        let ws: WebSocket = null
        let statusTimeout = null
        const requestResponseHandler = new RequestResponseHandler()

        return {
            connect(url): AppThunk {
                return async (dispatch, getState) => {
                    const statusProcessor = new StatusProcessor()

                    function no_status_handler() {
                        dispatch(connectionSlice.actions.statusReceived(false))
                    }

                    function start_status_timeout() {
                        clear_status_timeout()
                        dispatch(connectionSlice.actions.statusReceived(true))
                        statusTimeout = setTimeout(no_status_handler, 5000) // 5 second timeout on status
                    }

                    function clear_status_timeout() {
                        clearTimeout(statusTimeout)
                    }

                    dispatch(connectionSlice.actions.connecting())
                    ws = new WebSocket(url)
                    ws.onopen = () => {
                        // websocket is open, so start expecting status messages
                        start_status_timeout()
                        // send a request to get the current config, but only if there's no current offline config
                        requestResponseHandler.request(ws, "get config").then(response => {
                            dispatch(configSlice.actions.setConfigFromRemote(response.config))
                        })
                        dispatch(connectionSlice.actions.connected())
                    }
                    ws.onclose = () => {
                        ws = null
                        clear_status_timeout()
                        dispatch(connectionSlice.actions.disconnected())
                    }
                    ws.onerror = () => {
                        if (ws) {
                            ws.close()
                            ws = null
                        }
                        clear_status_timeout()
                        dispatch(connectionSlice.actions.disconnected())
                    }
                    ws.onmessage = event => {
                        // message received so inspect it to decide where to route it (or parts of it)
                        try {
                            const msg = JSON.parse(event.data)
                            msg.telemetry && dispatch(telemetrySlice.actions.data(msg.telemetry))
                            if (msg.status) {
                                // restart status timer
                                start_status_timeout()
                                statusProcessor.process(msg, dispatch, ws, getState)
                            }
                            if (msg.stream) {
                                dispatch(gcodeSlice.actions.status(msg.stream))
                                const store = getState()
                                if (
                                    store.gcode.state === STREAMSTATE.STREAMSTATE_PAUSED_BY_ACTIVITY
                                ) {
                                    // gbc state is paused by activity -- we want to transition immediately to paused state
                                    // this is so UI can then allow operator to continue / unpause
                                    ws.send(updateStreamStateMsg(STREAMCOMMAND.STREAMCOMMAND_PAUSE))
                                }
                                // there may be capacity on the GBC queue where before there was none, so give
                                // an opportunity to stream more activities from the gcode queue
                                GCodeStreamer.update(
                                    dispatch,
                                    store.gcode,
                                    store.machine.currentState,
                                    streamItems => {
                                        ws.send(
                                            JSON.stringify({
                                                stream: streamItems
                                            })
                                        )
                                    }
                                )
                            }
                            // handle any responses to specific requests
                            msg.response && requestResponseHandler.response(msg.response)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            },
            send(msg): AppThunk {
                return () => ws?.send(msg)
            },
            request(type, body): AppThunk {
                return () => requestResponseHandler.request(ws, type, body)
            },
            disconnect(): AppThunk {
                return () => {
                    ws?.close()
                    ws = null
                }
            }
        }
    })()
}
