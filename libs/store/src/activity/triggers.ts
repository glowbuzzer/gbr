/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GTLT, TRIGGERACTION, TRIGGERON, TriggerOnTimer, TriggerParams, TRIGGERTYPE } from "../gbc"

abstract class TriggerBuilder {
    private readonly _type: TRIGGERON
    private _action: TRIGGERACTION

    protected constructor(type: TRIGGERON) {
        this._type = type
        return this
    }

    action(action: TRIGGERACTION) {
        this._action = action
        return this
    }

    build(): TriggerParams {
        return {
            type: this._type,
            action: this._action,
            ...this.params()
        }
    }

    abstract params()
}

export class TimerTriggerBuilder extends TriggerBuilder {
    private readonly _delay: number

    constructor(delayInMs: number) {
        super(TRIGGERON.TRIGGERON_TIMER)
        this._delay = delayInMs
    }

    params(): { timer: TriggerOnTimer } {
        return {
            timer: {
                delay: this._delay
            }
        }
    }
}

abstract class InputTriggerBuilder extends TriggerBuilder {
    private readonly _index: number

    protected constructor(type: TRIGGERON, index: number) {
        super(type)
        this._index = index
    }

    props() {
        return {
            input: this._index
        }
    }
}

export class DigitalInputTriggerBuilder extends InputTriggerBuilder {
    private _when: TRIGGERTYPE

    constructor(index: number) {
        super(TRIGGERON.TRIGGERON_DIGITAL_INPUT, index)
    }

    when(when: TRIGGERTYPE) {
        this._when = when
        return this
    }

    params() {
        return {
            digital: {
                ...super.props(),
                when: this._when
            }
        }
    }
}

abstract class NumericInputTriggerBuilder extends InputTriggerBuilder {
    private _value: number
    private _gtlt: GTLT

    protected constructor(type: TRIGGERON, index: number) {
        super(type, index)
    }

    gt(value: number) {
        this._gtlt = GTLT.GREATERTHAN
        this._value = value
        return this
    }

    lt(value: number) {
        this._gtlt = GTLT.LESSTHAN
        this._value = value
        return this
    }

    props() {
        return {
            ...super.props(),
            when: this._gtlt,
            value: this._value
        }
    }
}

export class AnalogInputTriggerBuilder extends NumericInputTriggerBuilder {
    constructor(index: number) {
        super(TRIGGERON.TRIGGERON_ANALOG_INPUT, index)
    }

    params() {
        return {
            analog: this.props()
        }
    }
}

export class IntegerInputTriggerBuilder extends NumericInputTriggerBuilder {
    constructor(index: number) {
        super(TRIGGERON.TRIGGERON_INTEGER_INPUT, index)
    }

    params() {
        return {
            integer: this.props()
        }
    }
}
