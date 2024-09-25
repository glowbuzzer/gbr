/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { ECM_CYCLIC_STATE, useConnection, useEthercatMasterCyclicStatus } from "@glowbuzzer/store"
import { Space, Spin } from "antd"

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
    const ecm_cyclic_status = useEthercatMasterCyclicStatus()

    if (!connected) {
        return (
            <Space>
                <ConnectStatusIndicator color="red" />
                <div>NOT CONNECTED</div>
            </Space>
        )
    }

    switch (ecm_cyclic_status) {
        case ECM_CYCLIC_STATE.ECM_NOT_RUNNING:
            return (
                <DisconnectButtonHidden>
                    <Space>
                        <ConnectStatusIndicator color="orange" />
                        <div>NO ETHERCAT MASTER</div>
                    </Space>
                </DisconnectButtonHidden>
            )
        case ECM_CYCLIC_STATE.ECM_CYCLIC_RUNNING:
            return (
                <DisconnectButtonHidden>
                    <ConnectStatusIndicator color="green" />
                </DisconnectButtonHidden>
            )
        default:
            return (
                <DisconnectButtonHidden>
                    <Space>
                        <Spin size="small" />
                        <div>ETHERCAT MASTER BOOT</div>
                    </Space>
                </DisconnectButtonHidden>
            )
    }
}
