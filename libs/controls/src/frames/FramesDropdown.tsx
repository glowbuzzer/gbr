/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Frame, useFrames } from "@glowbuzzer/store"
import { TreeSelect } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { FramesIcon } from "./FramesIcon"
import styled from "styled-components"
import { dockDropdownStyle } from "../dock/styles"

const StyledTreeSelect = styled(TreeSelect)`
    ${dockDropdownStyle}
`

type FramesDropdownProps = {
    value: number
    onChange: (frame: number) => void
}

/**
 * @ignore
 */
export const FramesDropdown = ({ value, onChange }: FramesDropdownProps) => {
    const { asTree } = useFrames()

    function transform_frame(frames: Frame[]) {
        if (!frames) {
            return
        }
        return frames.map(frame => {
            return {
                key: frame.index,
                value: frame.index,
                title: frame.text,
                display: (
                    <>
                        <FramesIcon />
                        <span className="selected-text">{frame.text}</span>
                    </>
                ),
                children: transform_frame(frame.children)
            }
        })
    }

    const treeData = transform_frame(asTree)

    return (
        <StyledTreeSelect
            treeData={treeData}
            value={value}
            onChange={onChange}
            bordered={false}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 200 }}
            treeDefaultExpandAll
            treeNodeLabelProp={"display"}
            switcherIcon={<DownOutlined />}
        />
    )
}
