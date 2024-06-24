/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { useConnection, useEtherCATMasterStatus } from "@glowbuzzer/store"
import { Space } from "antd"

export const StatusBarConnectAndEmStatus = () => {
    const { connected } = useConnection()
    const { bsbs } = useEtherCATMasterStatus()

    if (!connected) {
        return (
            <Space>
                <ConnectStatusIndicator color="red" />
                <div>NOT CONNECTED</div>
            </Space>
        )
    }
    if (!bsbs) {
        return (
            <Space>
                <ConnectStatusIndicator color="orange" />
                <div>NO FIELDBUS</div>
            </Space>
        )
    }

    return <ConnectStatusIndicator color="green" />
}
