/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useConnection, useGbcVersionInfo } from "@glowbuzzer/store"
import { Popover, Tag } from "antd"
import { check_gbc_version } from "./GbcVersionCheck"

export const GbcVersionPanel = () => {
    const { connected } = useConnection()
    const { gbcVersion, schemaVersion } = useGbcVersionInfo()

    if (!(gbcVersion && schemaVersion && connected)) {
        return null
    }

    const { message, color } = check_gbc_version(gbcVersion, schemaVersion)
    return (
        <Popover content={message}>
            <span className="version-info">
                <Tag color={color}>GBC {gbcVersion}</Tag>
            </span>
        </Popover>
    )
}