/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useConnection, usePrefs } from "@glowbuzzer/store"
import { Button, Form, Input, Modal } from "antd"
import * as React from "react"

/**
 * @ignore
 */
export const ConnectSettings = ({ open, onClose }) => {
    const prefs = usePrefs()
    const { connected, connect } = useConnection()

    const labelCol = { span: 6 }

    function update_url(e) {
        prefs.update("url", e.target.value)
    }

    function connect_and_close() {
        if (!connected) {
            connect(prefs.current.url)
        }
        onClose()
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={connect_and_close}>
                    {connected ? "Close" : "Connect"}
                </Button>
            ]}
        >
            <Form>
                <Form.Item label="Connection URL" labelCol={labelCol} wrapperCol={{ span: 16 }}>
                    <Input defaultValue={prefs.current.url} onChange={update_url} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
