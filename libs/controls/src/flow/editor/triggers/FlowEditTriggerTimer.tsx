/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerEditProps } from "../common/types"
import { Space } from "antd"
import { PrecisionInput } from "../../../util/components/PrecisionInput"
import * as React from "react"

export const FlowEditTriggerTimer = ({ trigger, onChange }: TriggerEditProps) => {
    const parameters = trigger.timer || { delay: 1000 }

    return (
        <Space>
            delay
            <PrecisionInput
                value={parameters.delay}
                onChange={delay => onChange({ ...trigger, timer: { ...parameters, delay } })}
                precision={0}
                step={1000}
            />
            ms
        </Space>
    )
}
