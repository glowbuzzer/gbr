/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
import AceEditor from "react-ace"
import { useJointConfigurationList } from "@glowbuzzer/store"
import * as React from "react"

import "ace-builds/src-noconflict/theme-github.js"
import "ace-builds/src-noconflict/mode-json.js"
import { Form, Input } from "antd"
import styled from "styled-components"

const AceEditorFixed: typeof AceEditor = (AceEditor as any).default
    ? (AceEditor as any).default
    : AceEditor

const StyledDiv = styled.div`
    .ant-form-item {
        margin-bottom: 0;
    }
`

export const DriveConfigEditor = ({ index }) => {
    const config = useJointConfigurationList()[index]

    function update_config(new_config) {
        console.log("update_config", new_config)
    }

    return (
        <StyledDiv>
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} size="small">
                <Form.Item label="Name">
                    <Input
                        type={"text"}
                        value={config.name}
                        onChange={e => update_config({ ...config, name: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="Type">
                    <Input
                        type={"text"}
                        value={config.name}
                        onChange={e => update_config({ ...config, type: e.target.value })}
                    />
                </Form.Item>
            </Form>
            <AceEditorFixed
                mode="json"
                theme="github"
                width={"100%"}
                height={"100%"}
                value={JSON.stringify(config, null, 2)}
                onChange={update_config}
                showGutter={false}
                highlightActiveLine={false}
            />
        </StyledDiv>
    )
}
