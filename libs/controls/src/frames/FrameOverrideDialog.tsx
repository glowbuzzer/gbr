import React from "react"
import { Button, Form, Input, Modal } from "antd"

export const FrameOverrideDialog = ({ visible, onClose }) => {
    return (
        <Modal title="Work Offset Override" visible={visible} onCancel={onClose} footer={[<Button onClick={onClose}>Close</Button>]}>
            <Form></Form>
        </Modal>
    )
}
