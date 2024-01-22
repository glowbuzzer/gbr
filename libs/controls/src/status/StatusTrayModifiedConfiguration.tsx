/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useConnection, useOfflineConfig } from "@glowbuzzer/store"
import { StatusTrayItem } from "./StatusTrayItem"
import { DismissType } from "./StatusTrayProvider"
import { Button, message, Space } from "antd"
import * as React from "react"
import { useState } from "react"

/**
 * Status tray item that checks for various states of the local and remote configuration, and
 * displays appropriate actions if available.
 */
export const StatusTrayModifiedConfiguration = () => {
    const { modified, usingLocalConfiguration, readonly, upload, discard } = useOfflineConfig()
    const { connected } = useConnection()
    const [messageApi] = message.useMessage()
    const [uploading, setUploading] = useState(false)

    function upload_config() {
        setUploading(true)
        upload()
            .catch(err => messageApi.error(err))
            .finally(() => setUploading(false))
    }

    function fetch_remote() {
        discard()
    }

    if (!modified) {
        return null
    }

    return connected ? (
        readonly && usingLocalConfiguration ? (
            <StatusTrayItem id="local-configuration-override" dismissable={DismissType.DISMISSABLE}>
                Your project uses a local configuration but GBC is using a read-only configuration
                specified on the command line. The read-only configuration takes precedence and has
                been loaded.
            </StatusTrayItem>
        ) : usingLocalConfiguration ? (
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
                        <Button size="small" onClick={fetch_remote}>
                            Fetch
                        </Button>
                    </Space>
                }
            >
                Local configuration provided does not match remote. You should upload a new
                configuration.
            </StatusTrayItem>
        ) : (
            <StatusTrayItem
                id="local-configuration-modified"
                actions={
                    <Space>
                        <Button
                            size="small"
                            style={{ width: "100%" }}
                            onClick={upload_config}
                            disabled={uploading}
                        >
                            Save
                        </Button>
                        <Button size="small" onClick={discard}>
                            Discard
                        </Button>
                    </Space>
                }
            >
                Configuration has been modified since you last connected. You should save or discard
                your local changes.
            </StatusTrayItem>
        )
    ) : usingLocalConfiguration ? null : (
        <StatusTrayItem
            id="modified-configuration-not-connected"
            actions={
                <Button size="small" onClick={discard}>
                    Discard
                </Button>
            }
        >
            Configuration has been modified since last connect. You need to connect in order to save
            your local changes.
        </StatusTrayItem>
    )
}
