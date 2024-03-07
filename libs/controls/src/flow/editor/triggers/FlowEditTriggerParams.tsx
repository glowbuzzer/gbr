/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerEditProps } from "../common/types"
import * as React from "react"
import { TRIGGERON } from "@glowbuzzer/store"
import { FlowEditTriggerDigitalInput } from "./FlowEditTriggerDigitalInput"
import { FlowEditTriggerTimer } from "./FlowEditTriggerTimer"
import { FlowEditTriggerIntegerInput } from "./FlowEditTriggerIntegerInput"
import { FlowEditTriggerAnalogInput } from "./FlowEditTriggerAnalogInput"

export const FlowEditTriggerParams = (props: TriggerEditProps) => {
    switch (props.trigger.type) {
        case TRIGGERON.TRIGGERON_NONE:
            return null
        case TRIGGERON.TRIGGERON_DIGITAL_INPUT:
            return <FlowEditTriggerDigitalInput safeInput={false} {...props} />
        case TRIGGERON.TRIGGERON_SAFE_DIGITAL_INPUT:
            return <FlowEditTriggerDigitalInput safeInput={true} {...props} />
        case TRIGGERON.TRIGGERON_ANALOG_INPUT:
            return <FlowEditTriggerAnalogInput {...props} />
        case TRIGGERON.TRIGGERON_INTEGER_INPUT:
            return <FlowEditTriggerIntegerInput {...props} />
        case TRIGGERON.TRIGGERON_TIMER:
            return <FlowEditTriggerTimer {...props} />
        default: {
            return <div>[unsupported trigger type]</div>
        }
    }
}
