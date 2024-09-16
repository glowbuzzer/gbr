/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useConfigSync, useConnection } from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { Button, message, Space } from "antd"
import * as React from "react"
import { useState } from "react"

/**
 * Status tray item that checks for various states of the local and remote configuration, and
 * displays appropriate actions if available.
 */
export const StatusTrayModifiedConfiguration = () => {
    const { connected } = useConnection()
    const [requiresSync, sync] = useConfigSync()
    const [messageApi] = message.useMessage()
    const [uploading, setUploading] = useState(false)

    function upload_config() {
        setUploading(true)
        sync()
            .catch(err => messageApi.error(err))
            .finally(() => setUploading(false))
    }

    if (!connected || !requiresSync) {
        return null
    }

    return (
        <StatusTrayItem
            id="local-configuration-mismatch"
            actions={
                <Space>
                    <Button
                        size="small"
                        type="primary"
                        onClick={upload_config}
                        disabled={uploading}
                    >
                        Upload
                    </Button>
                </Space>
            }
        >
            Local configuration is out of sync. You must upload your configuration changes.
        </StatusTrayItem>
    )
}
