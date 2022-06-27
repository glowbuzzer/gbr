/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { FC, ReactNode, useContext } from "react"
import { tileContext } from "./TileContext"
import { Button, Modal } from "antd"
import { EditOutlined } from "@ant-design/icons"

type TileSettingsProps = {
    title?: string
    onConfirm(): void
    onReset?(): void
    children: ReactNode
}

/** @ignore - not currently supported */
export const TileSettings: FC<TileSettingsProps> = ({ title, onConfirm, onReset, children }) => {
    const { showSettings, setShowSettings } = useContext(tileContext)

    function cancel() {
        if (onReset) {
            onReset()
        }
        setShowSettings(false)
    }

    function ok() {
        onConfirm()
        setShowSettings(false)
    }

    return (
        <>
            <Button onClick={() => setShowSettings(!showSettings)} icon={<EditOutlined />} />
            <Modal
                destroyOnClose={true}
                title={title}
                visible={showSettings}
                onCancel={cancel}
                onOk={ok}
            >
                {children}
            </Modal>
        </>
    )
}
