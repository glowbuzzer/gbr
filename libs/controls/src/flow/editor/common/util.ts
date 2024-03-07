/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    GTLT,
    TRIGGERON,
    TriggerParams,
    TRIGGERTYPE,
    useAnalogInputList,
    useDigitalInputList,
    useIntegerInputList,
    useSafetyDigitalInputList
} from "@glowbuzzer/store"

export function update_trigger_type(trigger: TriggerParams, existingType: TRIGGERON) {
    // if the type has changed we need to reset to sensible defaults
    const { type } = trigger
    if (type !== existingType) {
        const props = { type, action: trigger.action }
        switch (trigger.type) {
            case TRIGGERON.TRIGGERON_NONE: {
                return props
            }
            case TRIGGERON.TRIGGERON_DIGITAL_INPUT:
                return {
                    ...props,
                    digital: { input: 0, when: TRIGGERTYPE.TRIGGERTYPE_RISING }
                }
            case TRIGGERON.TRIGGERON_ANALOG_INPUT:
                return {
                    ...props,
                    analog: { input: 0, value: 0, when: GTLT.GREATERTHAN }
                }
            case TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT:
                return {
                    ...props,
                    digital: { input: 0, when: TRIGGERTYPE.TRIGGERTYPE_RISING }
                }
            case TRIGGERON.TRIGGERON_INTEGER_INPUT:
                return {
                    ...props,
                    integer: { input: 0, value: 0, when: GTLT.GREATERTHAN }
                }
            case TRIGGERON.TRIGGERON_TIMER:
                return {
                    ...props,
                    timer: { delay: 1000 }
                }
            default:
                throw new Error("Unexpected trigger type")
        }
    }
    return trigger
}

export function useEnabledTriggerOnOptions() {
    return [
        useDigitalInputList(),
        useSafetyDigitalInputList(),
        useAnalogInputList(),
        useIntegerInputList(),
        [true] // timer always enabled
    ].map(list => list?.length > 0)
}
