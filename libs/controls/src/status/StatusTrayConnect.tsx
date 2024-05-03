/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectionState, useConnection, usePrefs } from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { Button, Space } from "antd"
import { ConnectSettings } from "../connect/ConnectSettings"

export const StatusTrayConnect = () => {
    const { state, connected, connect } = useConnection()
    const prefs = usePrefs()
    const [showSettings, setShowSettings] = React.useState(false)

    if (connected || state === ConnectionState.CONNECTING) {
        return null
    }

    function connect_default() {
        connect(prefs.current.url)
    }

    return (
        <StatusTrayItem
            id="connect"
            actions={
                <Space>
                    <Button size="small" onClick={connect_default}>
                        Connect
                    </Button>
                    <Button size="small" onClick={() => setShowSettings(true)}>
                        Settings
                    </Button>
                </Space>
            }
        >
            <ConnectSettings open={showSettings} onClose={() => setShowSettings(false)} />
            Not currently connected
        </StatusTrayItem>
    )
}
