/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { DockButton } from "../dock/DockToolbar"
import { ReactComponent as ContactlessIcon } from "@material-symbols/svg-400/outlined/contactless.svg"
import styled from "styled-components"
import { useConnection } from "@glowbuzzer/store"
import { classes } from "../util/classes"

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
`

export const ConnectTabButtons = () => {
    const connection = useConnection()

    function toggle_connection() {
        if (connection.connected) {
            connection.setAutoConnect(false)
            connection.disconnect()
        } else {
            connection.setAutoConnect(true)
        }
    }

    const className = classes("anticon", connection.connected && "connected")

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