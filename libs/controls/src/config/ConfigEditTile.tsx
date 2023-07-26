/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { Input, message, Upload } from "antd"
import styled from "styled-components"
import { useConfig, useConfigLoader } from "@glowbuzzer/store"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { ReactComponent as FileUploadIcon } from "@material-symbols/svg-400/outlined/file_upload.svg"
import { ReactComponent as FileOpenIcon } from "@material-symbols/svg-400/outlined/file_open.svg"
import { ReactComponent as ResetConfigIcon } from "@material-symbols/svg-400/outlined/restart_alt.svg"
import { ReactComponent as FormatConfigIcon } from "@material-symbols/svg-400/outlined/format_align_left.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"

const StyledDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    .editor {
        flex-grow: 1;

        textarea {
            height: 100% !important;
            font-family: monospace;
            resize: none;
        }
    }

    .ant-upload {
        font-size: inherit;
    }
`

/**
 * The configuration editor tile allows the user to edit the GBC configuration, load a configuration from disk and upload the new configuration.
 */
export const ConfigEditTile = () => {
    const config = useConfig()
    const loader = useConfigLoader()

    const [editedConfig, setEditedConfig] = useState(JSON.stringify(config, null, 4))
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
        loader(configObject).then(() => message.success("Configuration updated"))
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
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={FileUploadIcon}
                        useFill={true}
                        button
                        title="Save and Upload"
                        onClick={upload}
                    />
                    <Upload beforeUpload={before_upload} maxCount={1} showUploadList={false}>
                        <GlowbuzzerIcon
                            useFill={true}
                            Icon={FileOpenIcon}
                            button
                            title="Load Config from File"
                        />
                    </Upload>
                    <GlowbuzzerIcon
                        useFill={true}
                        Icon={ResetConfigIcon}
                        button
                        title="Undo Changes"
                        onClick={reset}
                    />
                </DockToolbarButtonGroup>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        useFill={true}
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
