/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Space } from "antd"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import * as React from "react"
import { useGlowbuzzerMode } from "../modes"
import { ManualMode } from "@glowbuzzer/store"
import { useOperationEnabled } from "../util"
import { ReactComponent as HandIcon } from "@material-symbols/svg-400/outlined/pan_tool.svg"
import { ReactComponent as HandIconDisabled } from "@material-symbols/svg-400/outlined/do_not_touch.svg"

export const StatusBarHandGuidedIndicator = () => {
    const { mode } = useGlowbuzzerMode()
    const op = useOperationEnabled()

    const handGuidedModeRequested = mode === ManualMode.HAND_GUIDED
    if (!handGuidedModeRequested) {
        return null
    }

    return (
        <Space className={op ? "enabled" : "disabled"}>
            <GlowbuzzerIcon Icon={op ? HandIcon : HandIconDisabled} />
            HAND GUIDED MODE
        </Space>
    )
}
