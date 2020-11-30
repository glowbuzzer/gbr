import { AppThunk, Connection } from "./Connection"
import { telemetrySlice } from "../telemetry"
import { machineSlice, updateMachineControlWordMsg, updateMachineTargetMsg } from "../machine"
import { jointsSlice } from "../joints"
import { kinematicsSlice } from "../kinematics"
import { toolPathSlice } from "../toolpath"
import { gcodeSlice } from "../gcode"
import { GCodeStreamer } from "../gcode/GCodeStreamer"
import { devToolsSlice, updateStatusFrequencyMsg } from "../devtools"
import { connectionSlice } from "./index"
import { processJogStateChanges, RootState } from "@glowbuzzer/store"
import { jogSlice } from "../jogging"
import { DevWebSocket } from "./DevWebSocket"
import { configSlice } from "../config"

abstract class ProcessorBase {
    protected first = true

    protected abstract process_internal(msg, dispatch, ws: WebSocket, getState: () => RootState, first: boolean)

    process(msg, dispatch, ws: WebSocket, getState: () => RootState) {
        this.process_internal(msg, dispatch, ws, getState, this.first)
        this.first = false
    }
}

class StatusProcessor extends ProcessorBase {
    process_internal(msg, dispatch, ws, getState, first) {
        const { actualTarget, requestedTarget, nextControlWord } = getState().machine
        const previousJogState = [...getState().jog]

        // reducer runs synchronously, so after dispatch the state is updated already
        msg.status.machine && dispatch(machineSlice.actions.status(msg.status.machine))
        msg.status.joint && dispatch(jointsSlice.actions.status(msg.status.joint))
        msg.status.kc && dispatch(kinematicsSlice.actions.status(msg.status.kc))
        msg.status.kc && dispatch(toolPathSlice.actions.status(msg.status.kc))
        msg.status.jog && dispatch(jogSlice.actions.status(msg.status.jog))

        // compare previous jog states with latest
        processJogStateChanges(previousJogState, getState().jog, msg => ws.send(msg))

        if (first) {
            if (actualTarget !== requestedTarget) {
                ws.send(updateMachineTargetMsg(requestedTarget))
            }
            if (!msg.status.kc) {
                console.error("First status message did not contain 'kc' info!")
            } else {
                dispatch(gcodeSlice.actions.init(msg.status.kc))
            }
        }

        if (nextControlWord) {
            console.log("Setting machine control word")
            ws.send(updateMachineControlWordMsg(nextControlWord))
        }
    }
}

class ResponseProcessor extends ProcessorBase {
    process_internal(msg, dispatch, ws, getState, first) {
        if (msg.response.get_config_response) {
            dispatch(configSlice.actions.set(msg.response.get_config_response))
        }
    }
}

class DevToolsProcessor extends ProcessorBase {
    protected process_internal(msg, dispatch, ws: WebSocket, getState: () => RootState, first: boolean) {
        if (first) {
            // load and send the desired frequency on startup
            try {
                const value = JSON.parse(window.localStorage.getItem("devtools.statusFrequency"))
                console.log("DISPATCH DESIRED REFRESH FREQUENCY", value)
                dispatch(() => {
                    ws.send(updateStatusFrequencyMsg(value))
                })
            } catch (e) {
                console.log(e)
            }
        }
        dispatch(devToolsSlice.actions.status(msg.devtools))
    }
}

/**
 * This needs to be global on window, otherwise there is a circular dependency: connection -> actions -> useConnect -> connection
 */
window.connection = ((): Connection => {
    let ws: WebSocket = null
    let statusTimeout = null

    return {
        connect(url): AppThunk {
            return async (dispatch, getState) => {
                const statusProcessor = new StatusProcessor()
                const responseProcessor = new ResponseProcessor()
                const devToolsProcessor = new DevToolsProcessor()

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
                    start_status_timeout()
                    ws.send(
                        JSON.stringify({
                            request: {
                                get_config: true
                            }
                        })
                    )
                    dispatch(connectionSlice.actions.connected())
                }
                ws.onclose = () => {
                    ws = null
                    clear_status_timeout()
                    dispatch(connectionSlice.actions.disconnected())
                }
                ws.onerror = () => {
                    ws.close()
                    ws = null
                    clear_status_timeout()
                    dispatch(connectionSlice.actions.disconnected())
                }
                ws.onmessage = event => {
                    try {
                        const msg = JSON.parse(event.data)
                        msg.telemetry && dispatch(telemetrySlice.actions.data(msg.telemetry))
                        if (msg.status) {
                            start_status_timeout()
                            statusProcessor.process(msg, dispatch, ws, getState)
                        }
                        if (msg.stream) {
                            dispatch(gcodeSlice.actions.status(msg.stream))
                            GCodeStreamer.update(dispatch, getState().gcode, streamItems => {
                                console.log("sending gcode")
                                ws.send(
                                    JSON.stringify({
                                        stream: streamItems
                                    })
                                )
                            })
                        }
                        if (msg.response) {
                            // responses to request we have sent
                            responseProcessor.process(msg, dispatch, ws, getState)
                        }
                        if (msg.devtools) {
                            devToolsProcessor.process(msg, dispatch, ws, getState)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        },
        send(msg): AppThunk {
            return _dispatch => ws.send(msg)
        },
        disconnect(): AppThunk {
            return () =>
                /*dispatch*/
                /*, getState*/ {
                    if (ws) {
                        ws.close()
                    }
                    ws = null
                }
        }
    }
})()
