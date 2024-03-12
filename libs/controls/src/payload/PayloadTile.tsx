/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, message, Space } from "antd"
import { PrecisionInput } from "../util/components/PrecisionInput"
import { useSoloActivity } from "@glowbuzzer/store"

export const PayloadTile = () => {
    const [payload, setPayload] = React.useState(0)
    const api = useSoloActivity(0)
    const [messaging, contextHolder] = message.useMessage()

    function update() {
        api.setPayload(payload)
            .promise()
            .then(() => messaging.success("Payload updated"))
    }

    return (
        <div style={{ padding: "10px" }}>
            {contextHolder}
            <Space>
                Set payload
                <PrecisionInput value={payload} precision={1} onChange={setPayload} />
                <Button size="small" onClick={update}>
                    Update
                </Button>
            </Space>
        </div>
    )
}
