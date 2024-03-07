/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    FlowBranch,
    GTLT,
    TRIGGERON,
    TriggerOnAnalogInput,
    TriggerOnDigitalInput,
    TriggerOnIntegerInput,
    TriggerOnUnsignedIntegerInput,
    TRIGGERTYPE
} from "@glowbuzzer/store"
import { MachineStateAll } from "./types"

export abstract class ClientSideTrigger<T = unknown, S = unknown> {
    protected initialValue: T

    constructor(
        protected branch: FlowBranch,
        init: MachineStateAll = null,
        protected select: (state: MachineStateAll) => T = null,
        private selectTrigger: (branch: FlowBranch) => S = null
    ) {
        this.initialValue = select?.(init)
    }

    public get flowIndex(): number {
        return this.branch.flowIndex
    }

    protected get trigger(): S {
        return this.selectTrigger(this.branch)
    }

    public abstract triggered(state: MachineStateAll): boolean
}

export class ImmediateTrigger extends ClientSideTrigger {
    triggered(): boolean {
        return true
    }
}

export class DigitalInputTrigger extends ClientSideTrigger<boolean, TriggerOnDigitalInput> {
    triggered(state: MachineStateAll): boolean {
        const now = this.select(state)
        switch (this.trigger.when) {
            case TRIGGERTYPE.TRIGGERTYPE_FALLING:
                return this.initialValue && !now
            default:
                // rising edge
                return this.initialValue && now
        }
    }
}

export class TimerTrigger extends ClientSideTrigger<number> {
    triggered(state: MachineStateAll): boolean {
        const now = this.select(state)
        return now - this.initialValue >= this.branch.trigger.timer.delay
    }
}

export class NumericInputTrigger extends ClientSideTrigger<
    number,
    TriggerOnIntegerInput | TriggerOnUnsignedIntegerInput | TriggerOnAnalogInput
> {
    triggered(state: MachineStateAll): boolean {
        const now = this.select(state)
        const threshold = this.trigger.value
        switch (this.trigger.when) {
            case GTLT.LESSTHAN:
                return now < threshold
            default:
                // greater than
                return now > threshold
        }
    }
}

export function triggerFactory(
    state: {
        integerInputs: any
        unsignedIntegerInputs: any
        heartbeat: number
        externalUnsignedIntegerInputs: any
        analogInputs: number[]
        digitalInputs: boolean[]
        externalIntegerInputs: any
        safetyDigitalInputs: boolean[]
    },
    busCycleTime: number
) {
    return branch => {
        switch (branch.trigger.type) {
            case TRIGGERON.TRIGGERON_NONE:
                return new ImmediateTrigger(branch)
            case TRIGGERON.TRIGGERON_ANALOG_INPUT:
                return new NumericInputTrigger(
                    branch,
                    state,
                    state => state.analogInputs[branch.trigger.analog.input],
                    branch => branch.trigger.analog
                )
            case TRIGGERON.TRIGGERON_DIGITAL_INPUT:
                return new DigitalInputTrigger(
                    branch,
                    state,
                    state => state.digitalInputs[branch.trigger.digital.input],
                    branch => branch.trigger.digital
                )
            case TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT:
                return new DigitalInputTrigger(
                    branch,
                    state,
                    state => state.safetyDigitalInputs[branch.trigger.digital.input],
                    branch => branch.trigger.digital
                )
            case TRIGGERON.TRIGGERON_INTEGER_INPUT:
                return new NumericInputTrigger(
                    branch,
                    state,
                    state => state.integerInputs[branch.trigger.integer.input],
                    branch => branch.trigger.integer
                )
            case TRIGGERON.TRIGGERON_UNSIGNED_INTEGER_INPUT:
                return new NumericInputTrigger(
                    branch,
                    state,
                    state => state.unsignedIntegerInputs[branch.trigger.unsignedInteger.input],
                    branch => branch.trigger.unsignedInteger
                )
            case TRIGGERON.TRIGGERON_EXTERNAL_INTEGER_INPUT:
                return new NumericInputTrigger(
                    branch,
                    state,
                    state => state.externalIntegerInputs[branch.trigger.integer.input],
                    branch => branch.trigger.integer
                )
            case TRIGGERON.TRIGGERON_EXTERNAL_UNSIGNED_INTEGER_INPUT:
                return new NumericInputTrigger(
                    branch,
                    state,
                    state =>
                        state.externalUnsignedIntegerInputs[branch.trigger.unsignedInteger.input],
                    branch => branch.trigger.unsignedInteger
                )
            case TRIGGERON.TRIGGERON_TIMER:
                return new TimerTrigger(
                    branch,
                    state,
                    state => state.heartbeat * (busCycleTime || 1)
                )
            case TRIGGERON.TRIGGERON_TICK:
                break
        }
    }
}
