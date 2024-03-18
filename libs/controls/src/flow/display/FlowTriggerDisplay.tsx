/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    GTLT,
    TRIGGERACTION,
    TRIGGERON,
    TriggerOnAnalogInput,
    TriggerOnIntegerInput,
    TriggerParams,
    TRIGGERTYPE,
    useAnalogInputList,
    useDigitalInputList,
    useIntegerInputList,
    useSafetyDigitalInputList
} from "@glowbuzzer/store"
import { toEnumString } from "../util"
import { StyledFlowSettingItem } from "../styles"
import * as React from "react"

function toTriggerActionString(action: TRIGGERACTION) {
    return toEnumString(TRIGGERACTION[action || 0])
}

function toTriggerDigitalWhenString(when: TRIGGERTYPE) {
    return toEnumString(TRIGGERTYPE[when || 0])
}

const FlowTriggerDisplayDigitalInput = ({ trigger }: { trigger: TriggerParams }) => {
    const digitals = useDigitalInputList()
    const safe_digitals = useSafetyDigitalInputList()

    const digital = trigger.digital
    const safetyInput = trigger.type === TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT
    const config = safetyInput ? safe_digitals[digital.input] : digitals[digital.input]
    const digital_name = config?.name || `Digital ${digital.input}`
    const action = trigger.action

    return (
        <StyledFlowSettingItem className="trigger-display">
            {!!action && <div>{toTriggerActionString(action)}</div>}
            <div>
                {safetyInput && "SAFETY"} {digital_name}
            </div>
            <div>{toTriggerDigitalWhenString(digital.when)}</div>
        </StyledFlowSettingItem>
    )
}
const FlowTriggerDisplayNumericInput = ({
    action,
    name,
    input
}: {
    action: TRIGGERACTION
    name: string
    input: TriggerOnAnalogInput | TriggerOnIntegerInput
}) => {
    return (
        <StyledFlowSettingItem className="trigger-display">
            {!!action && <div>{toTriggerActionString(action)}</div>}
            <div>{name}</div>
            <div>{input.when === GTLT.GREATERTHAN ? ">" : "<"}</div>
            <div>{input.value}</div>
        </StyledFlowSettingItem>
    )
}
export const FlowTriggerDisplay = ({ trigger }: { trigger: TriggerParams }) => {
    const analogs = useAnalogInputList()
    const integers = useIntegerInputList()

    switch (trigger.type) {
        case TRIGGERON.TRIGGERON_NONE:
            return (
                <StyledFlowSettingItem>
                    <div>IMMEDIATE START</div>
                </StyledFlowSettingItem>
            )
        case TRIGGERON.TRIGGERON_DIGITAL_INPUT:
        case TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT:
            return <FlowTriggerDisplayDigitalInput trigger={trigger} />
        case TRIGGERON.TRIGGERON_ANALOG_INPUT:
            return (
                <FlowTriggerDisplayNumericInput
                    input={trigger.analog}
                    name={analogs[trigger.analog.input]?.name || `Analog ${trigger.analog.input}`}
                    action={trigger.action}
                />
            )
        case TRIGGERON.TRIGGERON_INTEGER_INPUT:
            return (
                <FlowTriggerDisplayNumericInput
                    input={trigger.integer}
                    name={
                        integers[trigger.integer.input]?.name || `Integer ${trigger.integer.input}`
                    }
                    action={trigger.action}
                />
            )
        case TRIGGERON.TRIGGERON_TIMER:
            return (
                <StyledFlowSettingItem>
                    {!!trigger.action && <div>{toTriggerActionString(trigger.action)}</div>}
                    <div>delay {trigger.timer?.delay || 0} ms</div>
                </StyledFlowSettingItem>
            )
        default:
            return null
    }
}
