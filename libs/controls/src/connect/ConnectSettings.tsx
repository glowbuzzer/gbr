/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useConnection, usePrefs } from "@glowbuzzer/store"
import { Alert, Button, Flex, Form, Input, Modal } from "antd"
import * as React from "react"
import { useConnectionUrls } from "../app/hooks"

/**
 * @ignore
 */
export const ConnectSettings = ({ open, onClose }) => {
    const prefs = usePrefs()
    const { connected, connect } = useConnection()
    const { staticHost, gbcWebsocketUrl } = useConnectionUrls()

    const labelCol = { span: 6 }

    function update_url(e) {
        prefs.update("hostname", e.target.value)
    }

    function reset() {
        prefs.update("hostname", "")
    }

    function connect_and_close() {
        if (!connected) {
            connect(gbcWebsocketUrl)
        }
        onClose()
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="reset" onClick={reset} disabled={prefs.current.hostname?.length === 0}>
                    Reset
                </Button>,
                <Button key="close" onClick={connect_and_close}>
                    {connected ? "Close" : "Connect"}
                </Button>
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="Connection URL" labelCol={labelCol} wrapperCol={{ span: 24 }}>
                    <Flex vertical gap={8}>
                        <Input
                            value={prefs.current.hostname || ""}
                            onChange={update_url}
                            placeholder={
                                staticHost
                                    ? `Using configured hostname '${staticHost}'`
                                    : "Using system default hostname 'localhost'"
                            }
                        />
                        <div>Enter hostname only (without protocol or port)</div>
                    </Flex>
                </Form.Item>
            </Form>
        </Modal>
    )
}
