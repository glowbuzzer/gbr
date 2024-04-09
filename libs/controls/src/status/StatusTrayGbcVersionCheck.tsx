/*
 * Copyright (c) 2023-2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { GbcSchemaChecksum, useConnection, useGbcConfigInfo } from "@glowbuzzer/store"
import styled from "styled-components"
import { Tag } from "antd"
import { StatusTrayItem } from "./StatusTrayItem"
import { DismissType } from "./StatusTrayProvider"

const GBC_SUPPORTED_VERSION = [1, 9 /* add patch version to enforce upgrade for patch release */]

const StyledDiv = styled.div`
    margin: -5px -5px 5px -5px;
    background: rgba(0, 0, 0, 0.05);
    padding: 10px 10px;
    text-align: center;

    .ant-tag {
        display: block;
        text-align: center;
    }
`

export function check_gbc_version(
    gbcVersion: string,
    schemaVersion: string
): { supported: boolean; message?: string } {
    if (gbcVersion === "dev") {
        return {
            supported: true
        }
    }

    if (schemaVersion !== GbcSchemaChecksum) {
        return {
            supported: false,
            message: "Schema version mismatch. You may be connected to an incompatible GBC version"
        }
    }

    const supported_version = `v${GBC_SUPPORTED_VERSION.join(".")}`

    const [supported_major, supported_minor, supported_patch] = GBC_SUPPORTED_VERSION
    // actual version example v1.9.0
    const [major, minor, patch] = gbcVersion
        .substring(1)
        .split(".")
        .map(v => parseInt(v))

    if (major !== supported_major) {
        return {
            supported: false,
            message: `GBC major version is not supported. Version ${supported_major}.x.x is required`
        }
    }
    if (minor < supported_minor || patch < supported_patch) {
        return {
            supported: false,
            message: `GBC version is not supported. Version ${supported_version} or later is required`
        }
    }
    return {
        supported: true
    }
}

/**
 * Check if GBC version is supported and display a warning if not
 */
export const StatusTrayGbcVersionCheck = () => {
    const { gbcVersion, schemaVersion } = useGbcConfigInfo()
    const { connected } = useConnection()

    if (!(gbcVersion && schemaVersion && connected)) {
        return null
    }

    const { supported, message } = check_gbc_version(gbcVersion, schemaVersion)
    if (supported) {
        return null
    }

    return (
        <StatusTrayItem id="gbc-version-mismatch" dismissable={DismissType.DISMISSABLE}>
            <div style={{ color: "orange" }}>{message}</div>
        </StatusTrayItem>
    )
}
