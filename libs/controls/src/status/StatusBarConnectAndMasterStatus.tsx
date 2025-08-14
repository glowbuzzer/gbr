/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { ECM_CYCLIC_STATE, useConnection, useEthercatMasterCyclicStatus } from "@glowbuzzer/store"
import { Space, Spin } from "antd"
import { useMasterBootSuccessful } from "../app"

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

export const StatusBarConnectAndMasterStatus = () => {
    const { connected } = useConnection()
    const boot_successful = useMasterBootSuccessful()

    if (!connected) {
        return (
            <Space>
                <ConnectStatusIndicator color="red" />
                <div>NOT CONNECTED</div>
            </Space>
        )
    }

    return boot_successful ? (
        <DisconnectButtonHidden>
            <ConnectStatusIndicator color="green" />
        </DisconnectButtonHidden>
    ) : (
        <DisconnectButtonHidden>
            <Space>
                <Spin size="small" />
                <div>MASTER BOOT</div>
            </Space>
        </DisconnectButtonHidden>
    )
}
