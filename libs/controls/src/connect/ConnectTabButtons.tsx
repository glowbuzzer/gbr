/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ReactComponent as ContactlessIcon } from "@material-symbols/svg-400/outlined/contactless.svg"
import styled from "styled-components"
import { useConnection, useOfflineConfig, usePrefs } from "@glowbuzzer/store"
import { classes } from "../util/classes"
import { Button } from "antd"

const DockButton = styled(Button)`
    padding: 1px 6px;
    font-size: 10px;
    height: inherit;
`

const ConnectIndicator = styled.span`
  svg {
    width: 1.5em;
    height: 1.5em;

    path {
      fill: ${props => props.theme.colorText}
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
    const { modified } = useOfflineConfig()
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
        modified && "config-modified"
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
