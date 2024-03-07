/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerEditProps } from "../common/types"
import {
    TriggerOnDigitalInput,
    TRIGGERTYPE,
    useDigitalInputList,
    useSafetyDigitalInputList
} from "@glowbuzzer/store"
import { Select, Space } from "antd"
import { toEnumString } from "../../util"
import * as React from "react"

export const FlowEditTriggerDigitalInput = ({
    trigger,
    safeInput,
    onChange
}: TriggerEditProps & { safeInput: boolean }) => {
    const unsafeInputs = useDigitalInputList()
    const safeInputs = useSafetyDigitalInputList()

    const inputs = safeInput ? safeInputs : unsafeInputs
    const digital = trigger.digital || { when: TRIGGERTYPE.TRIGGERTYPE_RISING, input: 0 }

    function change(change: Pick<TriggerOnDigitalInput, "input" | "when">) {
        onChange({ ...trigger, digital: { ...digital, ...change } })
    }

    return (
        <Space>
            <Select
                size="small"
                popupMatchSelectWidth={false}
                value={digital.input}
                onChange={input => change({ input })}
            >
                {inputs.map((input, index) => (
                    <Select.Option key={index} value={index}>
                        {input.name}
                    </Select.Option>
                ))}
            </Select>
            <Select
                size="small"
                popupMatchSelectWidth={false}
                value={digital.when || TRIGGERTYPE.TRIGGERTYPE_RISING}
                onChange={when => change({ when })}
            >
                {[TRIGGERTYPE.TRIGGERTYPE_RISING, TRIGGERTYPE.TRIGGERTYPE_FALLING].map(input => (
                    <Select.Option key={input} value={input}>
                        {toEnumString(TRIGGERTYPE[input])}
                    </Select.Option>
                ))}
            </Select>
            edge
        </Space>
    )
}
