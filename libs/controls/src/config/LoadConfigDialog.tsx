/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Modal, Upload } from "antd"
import React, { useState } from "react"
import styled from "styled-components"
import { configSlice, useConfig, useConnection } from "@glowbuzzer/store"
import { FileOutlined } from "@ant-design/icons"
import { useDispatch } from "react-redux"

const StyledModal = styled(Modal)`
    pre {
        max-height: 400px;
        overflow-y: auto;
    }
`

/**
 * Dialog to load a configuration file
 * @param open Whether the dialog is open
 * @param onClose Callback to close the dialog
 */
export const LoadConfigDialog = ({ open, onClose }) => {
    const config = useConfig()
    const connection = useConnection()
    const dispatch = useDispatch()

    const [json, setJson] = useState(null)
    const [error, setError] = useState(null)

    function send() {
        setError(null)
        connection
            .request("load config", { config: json })
            .then(() => dispatch(configSlice.actions.setConfig(json)))
            .then(onClose)
            .catch(e => setError(e))
    }

    function before_upload(info) {
        setError(null)
        setJson(null)
        info.arrayBuffer().then(buffer => {
            setJson(JSON.parse(new TextDecoder("utf-8").decode(buffer)))
        })
        return false
    }

    return (
        <StyledModal
            title="Load Configuration"
            visible={open}
            onCancel={onClose}
            footer={[
                <Button key="load" onClick={send} type="primary" disabled={!json}>
                    Load
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>
            ]}
        >
            <Upload beforeUpload={before_upload} maxCount={1}>
                <Button icon={<FileOutlined />}>Select Config File</Button>
            </Upload>
            {error && <div>{error}</div>}
            {json && <pre>{JSON.stringify(json, null, 2)}</pre>}
        </StyledModal>
    )
}
