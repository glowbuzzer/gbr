/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { useConnection, useEtherCATMasterStatus } from "@glowbuzzer/store"
import { Space } from "antd"
import { useConnectionUrls } from "../app/hooks"

const prod = import.meta.env.MODE === "production"

const DisconnectButtonHidden = ({ children }) => {
    const { disconnect } = useConnection()
    if (prod) {
        return children
    }
    return (
        <div style={{ cursor: "pointer" }} onClick={disconnect}>
            {children}
        </div>
    )
}

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
            <DisconnectButtonHidden>
                <Space>
                    <ConnectStatusIndicator color="orange" />
                    <div>NO FIELDBUS</div>
                </Space>
            </DisconnectButtonHidden>
        )
    }

    return (
        <DisconnectButtonHidden>
            <ConnectStatusIndicator color="green" />
        </DisconnectButtonHidden>
    )
}
