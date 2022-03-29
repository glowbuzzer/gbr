import {
    DesiredState,
    determine_machine_state,
    handleMachineState,
    MachineState
} from "../../store/src/machine/MachineStateHandler"
import * as assert from "uvu/assert"
import {
    ActivityApiImpl,
    ACTIVITYSTATE,
    MACHINETARGET,
    updateMachineControlWordMsg,
    updateMachineTargetMsg
} from "../../store/src/api"
import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit"
import { activitySlice, gcodeSlice, jointsSlice } from "../../store/src"
import {
    kinematicsSlice,
    updateFroPercentageMsg,
    updateOffsetMsg
} from "../../store/src/kinematics"
import { make_plot } from "./plot"
import { GCodeSenderAdapter } from "../../store/src/gcode/GCodeSenderAdapter"
import { Quaternion, Vector3 } from "three"

function nextTick() {
    return new Promise(resolve => process.nextTick(resolve))
}

function near(v1, v2) {
    // are the values close
    return Math.abs(v1 - v2) < 0.0001
}

const rootReducer = combineReducers({
    activity: activitySlice.reducer,
    joint: jointsSlice.reducer,
    gcode: gcodeSlice.reducer,
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
    private activity_api: ActivityApiImpl
    private readonly enable_plot: boolean

    constructor(gbc, plot) {
        this.gbc = gbc
        this.enable_plot = plot
    }

    private capture(enabled) {
        this.capture_state = enabled ? [] : undefined
        return this
    }

    get m4_stream_total_cap() {
        return this.gbc.get_m4_stream_total_cap()
    }

    get m7_stream_total_cap() {
        return this.gbc.get_m7_stream_total_cap()
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
        }
        return this
    }

    reset(configFile?) {
        this.gbc.reset(configFile)

        this.store = configureStore({
            reducer: rootReducer
        })

        this.activity_api = new ActivityApiImpl(0, this.gbc.send)
        this.capture_state = undefined
        this.check_limits = true

        this.send(updateMachineTargetMsg(MACHINETARGET.MACHINETARGET_SIMULATION))
        this.send(updateFroPercentageMsg(0, 100))
        this.exec_double_cycle()

        return this
    }

    send(msg) {
        // console.log("SENDING", msg)
        this.gbc.send(msg)
    }

    verify() {
        // this performs some post-test checks
        this.gbc.verify()
        return this
    }

    private get status_msg() {
        return JSON.parse(this.gbc.status())
    }

    get status() {
        return this.status_msg.status
    }

    set_fro(kc: number, fro: number) {
        // set fro on KC 0
        this.send(updateFroPercentageMsg(kc, fro))
        this.exec_double_cycle()
    }

    set_joint_pos(joint: number, value: number) {
        this.gbc.set_fb_joint_pos(joint, value)
        return this
    }

    stream(stream) {
        // console.log("message", JSON.stringify(stream, null, 2))
        this.send(JSON.stringify({ stream }))
        return this
    }

    send_gcode(gcode) {
        const buffer = [] as any[]
        const adapter = new GCodeSenderAdapter(buffer, 200 /* this is same as test config */)
        adapter.execute(gcode)
        return this.stream(buffer)
    }

    get(selector) {
        return selector(this.status_msg)
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
                assert.is(near(this.gbc.get_fb_aout(index), value), true)
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
            streamActivityState: (value, msg?) => {
                const actual = ACTIVITYSTATE[this.gbc.get_streamed_activity_state()]
                const expected = ACTIVITYSTATE[value]
                if (msg && actual !== expected) {
                    console.log(msg)
                }
                assert.equal(actual, expected)
                return this
            },
            selector: (selector, expected, msg?) => {
                const statusMsg = this.status_msg
                const actual = selector(statusMsg)
                if (msg && actual !== expected) {
                    console.log("Selector mismatch: ", msg)
                }
                assert.equal(actual, expected)
                return this
            },
            near: (selector, expected, tolerance = 0.001, allowNeg = false) => {
                const actual = selector(this.status_msg)
                test_near(actual, expected, tolerance, allowNeg)
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
                                "incorrect stream item state at step " + n
                            )
                    }
                }
                return this
            }
        }
    }

    exec(count = 1, single_cycle = false) {
        if (this.capture_state) {
            for (let n = 0; n < count; n++) {
                this.gbc.run(1, single_cycle, this.check_limits)
                // get the joint status
                const status = this.status_msg.status
                status.joint && this.store.dispatch(jointsSlice.actions.status(status.joint))
                status.kc && this.store.dispatch(kinematicsSlice.actions.status(status.kc))
                status.activity &&
                    this.store.dispatch(activitySlice.actions.status(status.activity))
                this.status_msg.stream &&
                    this.store.dispatch(gcodeSlice.actions.status(this.status_msg.stream))

                const store_state = this.store.getState()

                const joints_act_pos = store_state.joint.map(j => j.actPos)

                const translation = store_state.kc[0].position.translation
                const rotation = store_state.kc[0].position.rotation

                const tag = store_state.gcode.tag
                const streamState = store_state.gcode.state
                const activityState = this.gbc.get_streamed_activity_state()

                this.capture_state.push({
                    joints: joints_act_pos,
                    translation,
                    rotation,
                    activity: { tag, streamState, activityState }
                })
            }
        } else {
            this.gbc.run(count, single_cycle, this.check_limits)
        }
        const status = this.status_msg.status
        const { activity } = status
        activity && this.store.dispatch(activitySlice.actions.status(activity))
        const { tag, state } = this.store.getState().activity[0]
        this.activity_api.update(tag, state)
        return this
    }

    exec_double_cycle() {
        this.exec(2)
    }

    get activity() {
        return this.activity_api
    }

    wrap(factory: () => Promise<any>) {
        const self = this
        return new (class {
            private resolution

            constructor() {
                this.resolve = this.resolve.bind(this)
                this.reject = this.reject.bind(this)
            }

            resolve(value) {
                this.resolution = value
                // console.log("RESOLVE!!!", tag)
                // this.state = true
            }

            reject(value) {
                this.resolution = value
                // console.log("REJECT!!!", tag)
                // this.state = false
            }

            start() {
                factory().then(this.resolve).catch(this.reject)
                return this
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

    get pdo() {
        return {
            set_din: (index, value) => {
                this.gbc.set_fb_din(index, value)
                return this
            },
            set_ain: (index, value) => {
                this.gbc.set_fb_ain(index, value)
                return this
            },
            set_iin: (index, value) => {
                this.gbc.set_fb_iin(index, value)
                return this
            }
        }
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
        assert.equal(
            currentState,
            desired === DesiredState.OPERATIONAL
                ? MachineState.OPERATION_ENABLED
                : MachineState.SWITCH_ON_DISABLED
        )
        return this
    }

    offset(translation: Vector3, rotation?: Quaternion) {
        this.send(updateOffsetMsg(0, translation, rotation))
        this.exec_double_cycle()
    }
}
