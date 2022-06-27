/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Button, Form, Input, Modal } from "antd"
import { usePrefs } from "@glowbuzzer/store"
import { UnitSelector } from "./UnitSelector"

type PreferencesDialogProps = {
    /** Whether the preferences dialog is visible */
    visible: boolean
    /** Invoked when the dialog is closed */
    onClose: () => void
}

/**
 * Provides a simple dialog that can be used to set user preferences such as display units.
 */
export const PreferencesDialog = ({ visible, onClose }: PreferencesDialogProps) => {
    const prefs = usePrefs()

    const labelCol = { span: 6 }
    const wrapperCol = { span: 6 }

    function update_url(e) {
        prefs.update("url", e.target.value)
    }

    return (
        <Modal
            title="Preferences"
            visible={visible}
            onCancel={onClose}
            footer={[<Button onClick={onClose}>Close</Button>]}
        >
            <Form>
                <Form.Item label="Connection URL" labelCol={labelCol} wrapperCol={{ span: 16 }}>
                    <Input defaultValue={prefs.current.url} onChange={update_url} />
                </Form.Item>

                <Form.Item label="Linear Units" labelCol={labelCol} wrapperCol={wrapperCol}>
                    <UnitSelector type="linear" />
                </Form.Item>
                <Form.Item label="Angular Units" labelCol={labelCol} wrapperCol={wrapperCol}>
                    <UnitSelector type="angular" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
