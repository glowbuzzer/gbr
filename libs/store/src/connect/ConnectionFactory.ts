import { AppThunk, Connection } from "./Connection"
import { telemetrySlice } from "../telemetry"
import { machineSlice } from "../machine"
import { jointsSlice } from "../joints"
import { kinematicsSlice, updateFroPercentageMsg } from "../kinematics"
import { toolPathSlice } from "../toolpath"
import { gcodeSlice } from "../gcode"
import { GCodeStreamer } from "../gcode/GCodeStreamer"
import { devToolsSlice, updateStatusFrequencyMsg } from "../devtools"
import { connectionSlice } from "./index"
import { jogSlice, processJogStateChanges } from "../jogging"
import { configSlice } from "../config"
import { digitalInputsSlice } from "../io/din"
import { digitalOutputsSlice } from "../io/dout"
import { analogOutputsSlice } from "../io/aout"
import { integerOutputsSlice } from "../io/iout"
import { analogInputsSlice } from "../io/ain"
import { integerInputsSlice } from "../io/iin"
import { tasksSlice } from "../tasks"
import { settings } from "../util/settings"
import { activitySlice } from "../activity"
import {
    updateMachineCommandMsg,
    updateMachineControlWordMsg,
    updateMachineTargetMsg
} from "../machine/machine_api"
import { RootState } from "../root"
import { framesSlice } from "../frames"

abstract class ProcessorBase {
    protected first = true

    protected abstract process_internal(
        msg,
        dispatch,
        ws: WebSocket,
        getState: () => RootState,
        first: boolean
    )

    process(msg, dispatch, ws: WebSocket, getState: () => RootState) {
        this.process_internal(msg, dispatch, ws, getState, this.first)
        this.first = false
    }
}

// noinspection DuplicatedCode
class StatusProcessor extends ProcessorBase {
    private tick: number

    process_internal(msg, dispatch, ws, getState, first) {
        const previousJogState = [...getState().jog] // this happens before the status update

        // reducer runs synchronously, so after dispatch the state is updated already
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
        msg.status.jog && dispatch(jogSlice.actions.status(msg.status.jog))

        // compare previous jog states with latest
        processJogStateChanges(previousJogState, getState().jog, msg => ws.send(msg))

        // this is after the status update on slices, so state now has latest from GBC
        const { actualTarget, requestedTarget, nextControlWord, heartbeat } = getState().machine

        if (first) {
            this.tick = 0

            dispatch(toolPathSlice.actions.reset(0)) // clear tool path on connect
            dispatch(framesSlice.actions.setActiveFrame(0)) // set active frame (equivalent to G54)

            if (actualTarget !== requestedTarget) {
                ws.send(updateMachineTargetMsg(requestedTarget))
            }
            if (!msg.status.kc) {
                console.error("First status message did not contain 'kc' info!")
            } else {
                dispatch(gcodeSlice.actions.init(msg.status.kc))

                const kinematics = getState().kinematics
                for (let n = 0; n < kinematics.length; n++) {
                    const { froTarget } = kinematics[n]
                    if (froTarget === 0) {
                        // set fro to 100% if not already set on connect
                        setTimeout(() => {
                            console.log("SETTING FRO TO 100 ON KC", n)
                            ws.send(updateFroPercentageMsg(n, 100))
                        }, 1000)
                    }
                }
            }
            dispatch(telemetrySlice.actions.init())

            // push any override frames on connect (from local storage)
            // ws.send(updateFrameOverridesMsg(getState().frames.overrides))
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
            console.log("Setting machine control word")
            ws.send(updateMachineControlWordMsg(nextControlWord))
        }

        this.tick++
    }
}

class ResponseProcessor extends ProcessorBase {
    process_internal(msg, dispatch, ws, getState, first) {
        if (msg.response.get_config_response) {
            dispatch(configSlice.actions.setConfig(msg.response.get_config_response))
        }
    }
}

const { load } = settings("devtools.statusFrequency")

class DevToolsProcessor extends ProcessorBase {
    protected process_internal(
        msg,
        dispatch,
        ws: WebSocket,
        getState: () => RootState,
        first: boolean
    ) {
        if (first) {
            // load and send the desired frequency on startup
            try {
                const value = load()
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
if (typeof window !== "undefined") {
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
                    console.log("CONNECTING!!!", new Error().stack)
                    ws = new WebSocket(url)
                    ws.onopen = () => {
                        start_status_timeout()
                        console.log("CONNECTED!!")
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
                        if (ws) {
                            ws.close()
                            ws = null
                        }
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
                return () => ws?.send(msg)
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
