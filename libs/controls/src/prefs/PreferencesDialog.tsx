/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Button, Form, Modal } from "antd"
import { UnitSelector } from "./UnitSelector"

type PreferencesDialogProps = {
    /** Whether the preferences dialog is visible */
    open: boolean
    /** Invoked when the dialog is closed */
    onClose: () => void
}

/**
 * Provides a simple dialog that can be used to set user preferences such as display units.
 * @param open Whether the dialog is open
 * @param onClose Callback to close the dialog
 */
export const PreferencesDialog = ({ open, onClose }: PreferencesDialogProps) => {
    const labelCol = { span: 6 }
    const wrapperCol = { span: 6 }

    return (
        <Modal
            title="Preferences"
            open={open}
            onCancel={onClose}
            footer={[<Button onClick={onClose}>Close</Button>]}
        >
            <Form>
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
