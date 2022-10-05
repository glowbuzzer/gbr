/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import { Button, Space } from "antd"
import { LoadConfigDialog, PreferencesDialog, ShowConfigDialog } from "@glowbuzzer/controls"
import { useConfig, useConnection } from "@glowbuzzer/store"
import styled from "styled-components"
import { FrameOverrideDialog } from "./FrameOverrideDialog"

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog open={visible} onClose={() => setVisible(false)} />
        </>
    )
}

const FrameOverridesButton = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Frame Overrides</Button>
            <FrameOverrideDialog open={open} onClose={() => setOpen(false)} />
        </>
    )
}

const ConfigButton = () => {
    const [open, setOpen] = useState(false)
    const config = useConfig()

    return (
        <div>
            <Button onClick={() => setOpen(true)}>View Config</Button>
            <ShowConfigDialog open={open} onClose={() => setOpen(false)} />
        </div>
    )
}

const LoadConfigButton = () => {
    const connection = useConnection()
    const [open, setOpen] = useState(false)

    return (
        <div>
            <Button onClick={() => setOpen(true)} disabled={!connection.connected}>
                Load Config
            </Button>
            <LoadConfigDialog open={open} onClose={() => setOpen(false)} />
        </div>
    )
}

const StyledDiv = styled.div`
    margin: 10px 10px 0 10px;
`

export const StandardButtons = ({ children = null }) => {
    return (
        <StyledDiv>
            <Space>
                <PrefsButton />
                <FrameOverridesButton />
                <ConfigButton />
                <LoadConfigButton />
                {children}
            </Space>
        </StyledDiv>
    )
}
