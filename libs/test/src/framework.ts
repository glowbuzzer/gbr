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
import { activitySlice, jointsSlice } from "../../store/src"
import { updateFroPercentageMsg } from "../../store/src/kinematics"
import { make_plot } from "./plot"
import { GCodeSenderAdapter } from "../../store/src/gcode/GCodeSenderAdapter"

function nextTick() {
    return new Promise(resolve => process.nextTick(resolve))
}

function near(v1, v2) {
    // are the values close
    return Math.abs(v1 - v2) < 0.0001
}

const rootReducer = combineReducers({
    activity: activitySlice.reducer,
    joint: jointsSlice.reducer
})

type State = ReturnType<typeof rootReducer>

export class GbcTest {
    private capture_state: number[][] | undefined
    private check_limits = true
    private readonly gbc: any
    private store: EnhancedStore<State>
    private activity_api: ActivityApiImpl

    constructor(gbc) {
        this.gbc = gbc
    }

    capture(enabled = true) {
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

    plot(filename) {
        if (this.capture_state) {
            make_plot(filename, this.capture_state, ["J1", "J2", "J3"])
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

        this.gbc.send(updateMachineTargetMsg(MACHINETARGET.MACHINETARGET_SIMULATION))
        this.gbc.send(updateFroPercentageMsg(0, 100))
        this.exec_double_cycle()

        return this
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
        this.gbc.send(updateFroPercentageMsg(kc, fro))
        this.exec_double_cycle()
    }

    stream(stream) {
        // console.log("message", JSON.stringify(stream, null, 2))
        this.gbc.send(JSON.stringify({ stream }))
        return this
    }

    send_gcode(gcode) {
        const buffer = [] as any[]
        const adapter = new GCodeSenderAdapter(buffer, 200 /* this is same as test config */)
        adapter.execute(gcode)
        return this.stream(buffer)
    }

    get assert() {
        function test_near(actual, expected, tolerance) {
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
            near: (selector, expected, tolerance = 0.001) => {
                const actual = selector(this.status_msg)
                test_near(actual, expected, tolerance)
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
                this.status_msg.status.joint &&
                    this.store.dispatch(jointsSlice.actions.status(this.status_msg.status.joint))
                const joints_act_pos = this.store.getState().joint.map(j => j.actPos)
                this.capture_state.push(joints_act_pos)
            }
        } else {
            this.gbc.run(count, single_cycle, this.check_limits)
        }
        const { activity } = this.status_msg.status
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
        return this.transition_to(DesiredState.OPERATIONAL)
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
        for (let n = 0; n < 5; n++) {
            const { statusWord, controlWord } = this.status_msg.status.machine
            const currentState = determine_machine_state(statusWord)
            const nextControlWord = handleMachineState(currentState, controlWord, desired)
            if (nextControlWord >= 0) {
                this.gbc.send(updateMachineControlWordMsg(nextControlWord))
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
}
