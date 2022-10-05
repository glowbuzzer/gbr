/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Modal } from "antd"
import React from "react"
import styled from "styled-components"
import { useConfig } from "@glowbuzzer/store"

const StyledModal = styled(Modal)`
    pre {
        max-height: 400px;
        overflow-y: auto;
    }
`

/**
 * Dialog to show the current configuration
 * @param open Whether the dialog is open
 * @param onClose Callback to close the dialog
 */
export const ShowConfigDialog = ({ open, onClose }) => {
    const config = useConfig()

    return (
        <StyledModal
            title="Configuration"
            visible={open}
            onCancel={onClose}
            footer={[<Button onClick={onClose}>Close</Button>]}
        >
            <pre>{JSON.stringify(config, null, 2)}</pre>
        </StyledModal>
    )
}
