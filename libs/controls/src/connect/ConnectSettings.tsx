/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { usePrefs } from "@glowbuzzer/store"
import { Button, Form, Input, Modal } from "antd"
import * as React from "react"

/**
 * @ignore
 */
export const ConnectSettings = ({ open, onClose }) => {
    const prefs = usePrefs()

    const labelCol = { span: 6 }

    function update_url(e) {
        prefs.update("url", e.target.value)
    }

    return (
        <Modal open={open} onCancel={onClose} footer={[<Button onClick={onClose}>Close</Button>]}>
            <Form>
                <Form.Item label="Connection URL" labelCol={labelCol} wrapperCol={{ span: 16 }}>
                    <Input defaultValue={prefs.current.url} onChange={update_url} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
