/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {
    DesiredState,
    determine_machine_state,
    handleMachineState,
    MachineState
} from "../../libs/store/src/machine/MachineStateHandler"
import * as assert from "uvu/assert"
import {
    ACTIVITYSTATE,
    FAULT_CAUSE,
    GlowbuzzerStatus,
    MACHINETARGET,
    OPERATION_ERROR,
    SoloActivityApi,
    STREAMCOMMAND,
    TASK_COMMAND,
    TASK_STATE,
    updateMachineControlWordMsg,
    updateMachineTargetMsg
} from "../../libs/store/src/api"
import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit"
import {
    ActivityApi,
    ActivityBuilder,
    activitySlice,
    jointsSlice,
    kinematicsSlice,
    StreamingActivityApi,
    streamSlice,
    updateFroMsg,
    updateOffsetMsg
} from "../../libs/store/src"
import { make_plot } from "./plot"
import { GCodeSenderAdapter } from "../../libs/store/src/gcode/GCodeSenderAdapter"
import { Quaternion, Vector3 } from "three"
import { ConfigBuilder } from "./builder"

class OperationError extends Error {
    code: OPERATION_ERROR

    constructor(code: OPERATION_ERROR, message: string) {
        super(message)
        this.code = code
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

function nextTick() {
    return new Promise(resolve => process.nextTick(resolve))
}

// function near(v1, v2) {
//     // are the values close
//     return Math.abs(v1 - v2) < 0.0001
// }

const rootReducer = combineReducers({
    activity: activitySlice.reducer,
    joint: jointsSlice.reducer,
    stream: streamSlice.reducer,
    kc: kinematicsSlice.reducer
})

type State = ReturnType<typeof rootReducer>

export class GbcTest {
    private capture_state:
        | {
              joints: number[]
              translation: Vector3
              rotation: Quaternion
              activity: { tag: number; streamState: number; activityState: number }
          }[]
        | undefined
    private check_limits = true
    private readonly gbc: any
    private store: EnhancedStore<State>
    private activity_api: SoloActivityApi
    private streaming_api: StreamingActivityApi
    private readonly enable_plot: boolean

    constructor(gbc, plot) {
        this.gbc = gbc
        this.enable_plot = plot
    }

    get m4_stream_total_cap() {
        return this.gbc.get_m4_stream_total_cap()
    }

    get m7_stream_total_cap() {
        return this.gbc.get_m7_stream_total_cap()
    }

    get status() {
        return this.status_msg.status
    }

    get assert() {
        function test_near(actual, expected, tolerance, allowNeg = false) {
            if (allowNeg) {
                actual = Math.abs(actual)
                expected = Math.abs(expected)
            }
            const diff = Math.abs(actual - expected)
            if (tolerance < 0) {
                // percentage tolerance
                const perc = Math.abs(diff / expected)
                if (perc > Math.abs(tolerance)) {
                    assert.not.ok(
                        diff,
                        `Numeric value test failed: expected=${expected}, actual=${actual}, tolerance=${
                            Math.abs(tolerance) * 100
                        }% (${diff * 100})`
                    )
                }
            } else {
                if (diff > tolerance) {
                    assert.not.ok(
                        diff,
                        `Numeric value test failed: expected=${expected}, actual=${actual}, tolerance=${tolerance} (${diff})`
                    )
                }
            }
        }

        return {
            doutPdo: (index, value) => {
                assert.equal(this.gbc.get_fb_dout(index), value)
                return this
            },
            aoutPdo: (index, value) => {
                test_near(this.gbc.get_fb_aout(index), value, 0.0001)
                return this
            },
            ioutPdo: (index, value) => {
                assert.equal(this.gbc.get_fb_iout(index), value)
                return this
            },
            jointPosPdo: (index, value, tolerance) => {
                test_near(this.gbc.get_fb_joint_pos(index), value, tolerance)
                return this
            },
            streamActivityState: (value, streamIndex: number, msg?) => {
                const actual = ACTIVITYSTATE[this.gbc.get_streamed_activity_state(streamIndex)]
                const expected = ACTIVITYSTATE[value]
                if (msg && actual !== expected) {
                    console.log(msg)
                }
                assert.equal(actual, expected)
                return this
            },
            selector: (selector: (s: GlowbuzzerStatus) => any, expected, msg?) => {
                const statusMsg = this.status_msg
                const actual = selector(statusMsg)
                if (msg && actual !== expected) {
                    console.log("Selector mismatch: ", msg, "expected", expected, "actual", actual)
                }
                assert.equal(actual, expected)
                return this
            },
            task: (taskNum: number, expected: TASK_STATE) => {
                const actual = this.status_msg.status.tasks[taskNum]?.taskState
                if (actual !== expected) {
                    console.log(
                        "Selector mismatch: expected",
                        TASK_STATE[expected],
                        "actual",
                        TASK_STATE[actual]
                    )
                }
                assert.equal(actual, expected)
            },
            near: (
                selector: (s: GlowbuzzerStatus) => any,
                expected,
                tolerance = 0.001,
                allowNeg = false
            ) => {
                const actual = selector(this.status_msg)
                test_near(actual, expected, tolerance, allowNeg)
                return this
            },
            gt: (selector, expected) => {
                const actual = selector(this.status_msg)
                if (actual < expected) {
                    assert.not.ok(
                        actual,
                        `Numeric gt test failed: expected=${expected}, actual=${actual}`
                    )
                }
                return this
            },
            lt: (selector, expected) => {
                const actual = selector(this.status_msg)
                if (actual >= expected) {
                    assert.not.ok(
                        actual,
                        `Numeric lt test failed: expected=${expected}, actual=${actual}`
                    )
                }
                return this
            },
            vel: (joint, expected) => {
                const actual = this.gbc.get_joint_vel(joint)
                test_near(actual, expected, -0.1 /* within 10% */)
                return this
            },
            streamSequence: (selector, seq: [number, number, ACTIVITYSTATE][], verify = true) => {
                let n = 0
                for (const [count, tag, state] of seq) {
                    n++
                    this.exec(count)
                    if (verify) {
                        this.assert
                            .selector(selector, tag, "incorrect stream item tag at step " + n) //
                            .assert.streamActivityState(
                                state,
                                0,
                                "incorrect stream item state at step " + n
                            )
                    }
                }
                return this
            },
            faultReactionActive: (code: FAULT_CAUSE) => {
                const active = this.status_msg.status.machine.activeFault & (1 << code)
                assert.ok(active, "Fault not found (active fault): " + FAULT_CAUSE[code])
                return this
            },
            fault: (code: FAULT_CAUSE) => {
                const active = this.status_msg.status.machine.faultHistory & (1 << code)
                assert.ok(active, "Fault not found (fault history): " + FAULT_CAUSE[code])
                return this
            }
        }
    }

    get activity() {
        return this.activity_api
    }

    get stream() {
        return this.streaming_api
    }

    get pdo() {
        const self = this
        return {
            set_din: (index, value) => {
                this.gbc.set_fb_din(index, value)
                return self
            },
            set_ain: (index, value) => {
                this.gbc.set_fb_ain(index, value)
                return self
            },
            set_iin: (index, value) => {
                this.gbc.set_fb_iin(index, value)
                return self
            }
        }
    }

    private get status_msg(): GlowbuzzerStatus {
        try {
            return JSON.parse(this.gbc.status())
        } catch (e) {
            console.log("Error parsing status", e)
            console.log(this.gbc.status())
            throw e
        }
    }

    disable_limit_check() {
        this.check_limits = false
        return this
    }

    enable_limit_check() {
        this.check_limits = true
        return this
    }

    plot(filename) {
        if (this.capture_state) {
            make_plot(filename, this.capture_state)
        } else {
            // console.log("No capture available to plot")
        }
        return this
    }

    init() {
        this.store = configureStore({
            reducer: rootReducer
        })

        this.activity_api = new SoloActivityApi(0, null, this.gbc.send)
        this.streaming_api = new StreamingActivityApi(0, null, this.gbc.send)
        this.capture_state = undefined

        this.send(updateMachineTargetMsg(MACHINETARGET.MACHINETARGET_SIMULATION))
        this.send(updateFroMsg(0, 1))
        this.exec_double_cycle()

        this.check_limits = true

        return this
    }

    reset(configFile?) {
        this.gbc.reset(configFile)
        return this.init()
    }

    reset_from_json(json, restoreJoints = false) {
        this.gbc.reset_from_json(JSON.stringify(json), restoreJoints)
        return this.init()
    }

    config() {
        return new ConfigBuilder(this)
    }

    destroy() {
        this.gbc.teardown()
    }

    send(msg) {
        this.gbc.send(msg)
    }

    verify() {
        // this performs some post-test checks
        this.gbc.verify()
        return this
    }

    set_fro(kc: number, fro: number) {
        // set fro on KC 0
        this.send(updateFroMsg(kc, fro))
        this.exec_double_cycle()
    }

    set_joint_pos(joint: number, value: number) {
        this.gbc.set_fb_joint_pos(joint, value)
        return this
    }

    set_joints(...joints) {
        this.disable_limit_check()
        for (let i = 0; i < joints.length; i++) {
            this.set_joint_pos(i, joints[i])
        }
        this.gbc.init_kc()
        this.exec(3)
        this.enable_limit_check()
    }

    enqueue(items, streamIndex = 0) {
        this.send(JSON.stringify({ stream: { streamIndex, items } }))
        return this
    }

    streamCommand(streamCommand: STREAMCOMMAND, streamIndex = 0) {
        this.send(
            JSON.stringify({
                command: {
                    stream: {
                        [streamIndex]: {
                            command: {
                                streamCommand
                            }
                        }
                    }
                }
            })
        )
        return this
    }

    send_gcode(gcode) {
        const buffer = [] as any[]
        const adapter = new GCodeSenderAdapter(0, buffer, 200, {
            // map g54 etc to frames using simple convention, as the tests don't read the actual workspaceOffset for frames in the config
            1: 0,
            2: 1,
            3: 2,
            4: 3,
            5: 4
        })
        adapter.execute(gcode)
        return this.enqueue(buffer)
    }

    get(selector) {
        return selector(this.status_msg)
    }

    exec(count = 1, single_cycle = false) {
        if (this.capture_state) {
            for (let n = 0; n < count; n++) {
                this.gbc.run(1, single_cycle, this.check_limits)
                // get the joint status
                const msg = this.status_msg
                const status = msg.status
                status.joint && this.store.dispatch(jointsSlice.actions.status(status.joint))
                status.kc && this.store.dispatch(kinematicsSlice.actions.status(status.kc))
                status.activity &&
                    this.store.dispatch(activitySlice.actions.status(status.activity))
                if (msg.stream) {
                    this.store.dispatch(streamSlice.actions.status(msg.stream))
                }

                const store_state = this.store.getState()

                const joints_act_pos = store_state.joint.map(j => j.actPos)

                const translation = store_state.kc[0].position.translation
                const rotation = store_state.kc[0].position.rotation

                const tag = store_state.stream[0].tag
                const streamState = store_state.stream[0].state
                const activityState = this.gbc.get_streamed_activity_state(0)

                this.capture_state.push({
                    joints: joints_act_pos,
                    translation: new Vector3(translation.x, translation.y, translation.z),
                    rotation: new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
                    activity: { tag, streamState, activityState }
                })
            }
        } else {
            this.gbc.run(count, single_cycle, this.check_limits)
        }
        const status = this.status_msg.status
        const { activity } = status
        // @ts-ignore
        activity && this.store.dispatch(activitySlice.actions.status(activity))
        const { tag, state } = this.store.getState().activity[0]
        this.activity_api.updateActivity(tag, state)
        return this
    }

    exec_double_cycle() {
        this.exec(2)
    }

    run(factory: (api: ActivityApi) => ActivityBuilder, max_iterations = 1000) {
        const builder = factory(this.activity_api)
        const activity = this.wrap(builder.promise)
        return activity.run(max_iterations)
    }

    wrap(factory: () => Promise<any>) {
        const self = this
        return new (class {
            public resolution

            constructor() {
                this.resolve = this.resolve.bind(this)
                this.reject = this.reject.bind(this)
            }

            resolve(value) {
                this.resolution = value
            }

            reject(value) {
                this.resolution = value
            }

            start() {
                factory().then(this.resolve).catch(this.reject)
                return this
            }

            async run(max_iterations = 100) {
                this.start()
                let count = 0
                while (count < max_iterations && !this.resolution?.completed) {
                    self.exec(5)
                    count += 5
                    await nextTick()
                }
                if (self.status_msg.status.machine.operationError) {
                    throw new OperationError(
                        self.status_msg.status.machine.operationError,
                        self.status_msg.status.machine.operationErrorMessage
                    )
                }
                if (count >= max_iterations) {
                    throw new Error("Activity did not complete in max given iterations")
                }
            }

            iterations(count: number, single_cycle = false) {
                self.exec(count, single_cycle)
                return this
            }

            async assertCompleted() {
                // we need to allow node to process the event loop at this point to flush through async promise(s)
                await nextTick()
                assert.equal(this.resolution?.completed, true)
                return this
            }

            async assertNotResolved() {
                await nextTick()
                assert.equal(this.resolution, undefined)
                return this
            }

            async assertCancelled() {
                await nextTick()
                assert.equal(this.resolution?.completed, false)
                return this
            }
        })()
    }

    enable_operation() {
        this.transition_to(DesiredState.OPERATIONAL)
        this.capture(this.enable_plot)
        return this
    }

    transition_to(desired: DesiredState) {
        this.exec_double_cycle()
        for (let n = 0; n < 5; n++) {
            const { statusWord, controlWord } = this.status_msg.status.machine
            const currentState = determine_machine_state(statusWord)
            const nextControlWord = handleMachineState(currentState, controlWord, desired)
            if (nextControlWord >= 0) {
                this.send(updateMachineControlWordMsg(nextControlWord))
                this.exec_double_cycle()
            }
        }
        const { statusWord } = this.status_msg.status.machine
        const currentState = determine_machine_state(statusWord)

        const equal =
            currentState ===
            (desired === DesiredState.OPERATIONAL
                ? MachineState.OPERATION_ENABLED
                : MachineState.SWITCH_ON_DISABLED)

        if (!equal) {
            // convert status to binary string
            const statusStr = statusWord.toString(2).padStart(16, "0")

            console.log("MACHINE STATUS", JSON.stringify(this.status_msg.status.machine, null, 2))

            console.log(
                "STATE MISMATCH, DESIRED=",
                DesiredState[desired],
                "CURRENT=",
                DesiredState[currentState],
                "=",
                currentState,
                "BIN",
                statusStr
            )
            process.exit(1)
        }

        // assert.equal(
        //     currentState,
        //     desired === DesiredState.OPERATIONAL
        //         ? MachineState.OPERATION_ENABLED
        //         : MachineState.SWITCH_ON_DISABLED
        // )
        return this
    }

    offset(translation: Vector3, rotation: Quaternion) {
        this.send(
            updateOffsetMsg(
                0,
                {
                    x: translation.x,
                    y: translation.y,
                    z: translation.z
                },
                {
                    x: rotation.x,
                    y: rotation.y,
                    z: rotation.z,
                    w: rotation.w
                }
            )
        )
        this.exec_double_cycle()
    }

    private capture(enabled) {
        this.capture_state = enabled ? [] : undefined
        return this
    }

    task(taskIndex: number, taskCommand: TASK_COMMAND) {
        this.send(
            JSON.stringify({
                command: {
                    task: {
                        [taskIndex]: {
                            command: {
                                taskCommand
                            }
                        }
                    }
                }
            })
        )
        return this
    }
}
