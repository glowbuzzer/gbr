import { AppThunk, Connection } from "./Connection"
import { DevWebSocket } from "./DevWebSocket"
import { telemetrySlice } from "../telemetry"
import { machineSlice, MachineTarget, updateMachineControlWordMsg, updateMachineTargetMsg } from "../machine"
import { jointsSlice } from "../joints"
import { kinematicsSlice } from "../kinematics"
import { toolPathSlice } from "../toolpath"
import { gcodeSlice } from "../gcode"
import { GCodeStreamer } from "../gcode/GCodeStreamer"
import { devToolsSlice, updateStatusFrequencyMsg } from "../devtools"
import { connectionSlice } from "./index"
import { RootState } from "@glowbuzzer/store"

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

        // reducer runs synchronously, so after dispatch the state is updated already
        msg.status.machine && dispatch(machineSlice.actions.status(msg.status.machine))
        msg.status.joint && dispatch(jointsSlice.actions.status(msg.status.joint))
        msg.status.kc && dispatch(kinematicsSlice.actions.status(msg.status.kc))
        msg.status.kc && dispatch(toolPathSlice.actions.status(msg.status.kc))

        if (first) {
            if (actualTarget !== requestedTarget) {
                console.log("UPDATING TARGET STATE ON LOAD!!!", MachineTarget[requestedTarget])
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

class DevToolsProcessor extends ProcessorBase {
    protected process_internal(msg, dispatch, ws: WebSocket, getState: () => RootState, first: boolean) {
        if (first) {
            // load and send the desired frequency on startup
            try {
                const value = JSON.parse(window.localStorage.getItem("devtools.statusFrequency"))
                console.log("DISPATCH DESIRED REFRESH FREQUENCY", value)
                dispatch(dispatch => {
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

    return {
        connect(url): AppThunk {
            return async (dispatch, getState) => {
                const statusProcessor = new StatusProcessor()
                const devToolsProcessor = new DevToolsProcessor()

                dispatch(connectionSlice.actions.connecting())
                ws = new DevWebSocket(url)
                ws.onopen = () => dispatch(connectionSlice.actions.connected())
                ws.onclose = () => dispatch(connectionSlice.actions.disconnected())
                ws.onerror = err => {
                    // TODO put in error message
                    ws.close()
                    ws = null
                    dispatch(connectionSlice.actions.error("error message"))
                }
                ws.onmessage = event => {
                    try {
                        const msg = JSON.parse(event.data)
                        msg.telemetry && dispatch(telemetrySlice.actions.data(msg.telemetry))
                        if (msg.status) {
                            statusProcessor.process(msg, dispatch, ws, getState)
                        }
                        if (msg.stream) {
                            dispatch(gcodeSlice.actions.status(msg.stream))
                            GCodeStreamer.update(dispatch, getState().gcode, msg => {
                                console.log("sending gcode")

                                ws.send(
                                    JSON.stringify({
                                        stream: msg
                                    })
                                )
                            })
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
            return dispatch => ws.send(msg)
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
