/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ReactComponent as ContactlessIcon } from "@material-symbols/svg-400/outlined/contactless.svg"
import styled from "styled-components"
import { useOfflineConfig, useConfigState, useConnection, usePrefs } from "@glowbuzzer/store"
import { classes } from "../util/classes"
import { Button } from "antd"

const DockButton = styled(Button)`
    padding: 1px 6px;
    font-size: 11px;
    height: inherit;
    color: rgba(0, 0, 0, 0.7);
`

const ConnectIndicator = styled.span`
    svg {
        width: 2em;
        height: 2em;

        path {
            fill: rgba(0, 0, 0, 0.5);
        }
    }

    &.connected path {
        fill: #00b700;
    }

    &.config-modified path {
        fill: #ffae00;
    }
`

/**
 * @ignore
 */
export const ConnectTabButtons = () => {
    const connection = useConnection()
    const [config_modified] = useOfflineConfig()
    const prefs = usePrefs()

    function toggle_connection() {
        if (connection.connected) {
            connection.disconnect()
        } else {
            connection.connect(prefs.current.url)
        }
    }

    const className = classes(
        "anticon",
        connection.connected && "connected",
        config_modified && "config-modified"
    )

    return (
        <>
            <DockButton key="connect-button" onClick={toggle_connection}>
                {connection.connected ? "Disconnect" : "Connect"}
            </DockButton>
            <ConnectIndicator key="connect-indicator" className={className}>
                <ContactlessIcon viewBox="0 0 48 48" />
            </ConnectIndicator>
        </>
    )
}
