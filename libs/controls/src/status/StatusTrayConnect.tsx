/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ConnectionState, useConnection, usePrefs } from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { Button, Space } from "antd"
import { ConnectSettings } from "../connect"
import { useConnectionUrls } from "../app/hooks"

export const StatusTrayConnect = () => {
    const { state, connected, connect } = useConnection()
    const [showSettings, setShowSettings] = React.useState(false)
    const { gbcWebsocketUrl, readonly } = useConnectionUrls()

    if (connected || state === ConnectionState.CONNECTING) {
        return null
    }

    function connect_default() {
        connect(gbcWebsocketUrl)
    }

    return (
        <StatusTrayItem
            id="connect"
            actions={
                <Space>
                    <Button size="small" onClick={connect_default}>
                        Connect
                    </Button>
                    {readonly || (
                        <Button size="small" onClick={() => setShowSettings(true)}>
                            Settings
                        </Button>
                    )}
                </Space>
            }
        >
            <ConnectSettings open={showSettings} onClose={() => setShowSettings(false)} />
            Not currently connected
        </StatusTrayItem>
    )
}
