/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Input, message, Upload } from "antd"
import styled from "styled-components"
import { configSlice, useConfig, useConnection } from "@glowbuzzer/store"
import { useEffect, useState } from "react"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { ReactComponent as FileUploadIcon } from "@material-symbols/svg-400/outlined/file_upload.svg"
import { ReactComponent as FileOpenIcon } from "@material-symbols/svg-400/outlined/file_open.svg"
import { ReactComponent as ResetConfigIcon } from "@material-symbols/svg-400/outlined/restart_alt.svg"
import { ReactComponent as FormatConfigIcon } from "@material-symbols/svg-400/outlined/format_align_left.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { LoadConfigDialog } from "@glowbuzzer/controls"
import { useDispatch } from "react-redux"

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    .editor {
        flex-grow: 1;

        textarea {
            height: 100%;
            font-family: monospace;
            resize: none;
        }
    }

    .ant-upload {
        font-size: inherit;
    }
`

export const ConfigEditTile = () => {
    const config = useConfig()
    const connection = useConnection()
    const dispatch = useDispatch()

    const [editedConfig, setEditedConfig] = useState(JSON.stringify(config, null, 4))
    const [showLoadConfigDialog, setShowLoadConfigDialog] = useState(false)
    const [error, setError] = useState(null)

    function update_edited_config(e) {
        setEditedConfig(e.target.value)
    }

    function reset() {
        setEditedConfig(JSON.stringify(config, null, 4))
    }

    useEffect(() => {
        reset()
    }, [config])

    function upload() {
        setError(null)
        const configObject = JSON.parse(editedConfig)
        connection
            .request("load config", { config: configObject })
            .then(() => {
                message.success("Configuration updated")
                return dispatch(configSlice.actions.setConfig(configObject))
            })
            .catch(e => setError(e))
    }

    function reformat() {
        setEditedConfig(JSON.stringify(JSON.parse(editedConfig), null, 4))
    }

    function before_upload(info) {
        setEditedConfig(JSON.stringify(config, null, 4))
        info.arrayBuffer().then(buffer => {
            message.success("Configuration loaded")
            setEditedConfig(new TextDecoder("utf-8").decode(buffer))
        })
        return false
    }

    return (
        <StyledDiv>
            <LoadConfigDialog
                open={showLoadConfigDialog}
                onClose={() => setShowLoadConfigDialog(false)}
            />
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={FileUploadIcon}
                        button
                        title="Save and Upload"
                        onClick={upload}
                    />
                    <Upload beforeUpload={before_upload} maxCount={1} showUploadList={false}>
                        <GlowbuzzerIcon Icon={FileOpenIcon} button title="Load Config from File" />
                    </Upload>
                    <GlowbuzzerIcon
                        Icon={ResetConfigIcon}
                        button
                        title="Undo Changes"
                        onClick={reset}
                    />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={FormatConfigIcon}
                        button
                        title="Format Config"
                        onClick={reformat}
                    />
                </DockToolbarButtonGroup>
            </DockToolbar>

            <div className="editor">
                <Input.TextArea
                    value={editedConfig}
                    onChange={update_edited_config}
                    bordered={false}
                    spellCheck={false}
                />
            </div>
        </StyledDiv>
    )
}
