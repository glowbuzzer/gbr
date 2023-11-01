/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Frame, useFrames } from "@glowbuzzer/store"
import { TreeSelect } from "antd"
import { DownOutlined } from "@ant-design/icons"
import styled from "styled-components"
import { ReactComponent as FramesIconIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"

const StyledTreeSelect = styled(TreeSelect)`
    height: 20px;

    .ant-select-selector {
        padding-left: 2px !important;
    }

    &.ant-select-open svg path {
        opacity: 0.2;
    }
`

const StyledFramesIcon = styled(FramesIconIcon)`
    width: 18px;
    height: 18px;
    transform: translate(0, 2px);
    padding-right: 3px;

    path {
        fill: ${props => props.theme.colorText};
        opacity: 0.8;
        stroke-width: 5px;
    }
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
                title: frame.name,
                display: (
                    <>
                        <StyledFramesIcon viewBox="0 0 48 48" />
                        <span className="selected-text">{frame.name}</span>
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
            popupMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 200 }}
            treeDefaultExpandAll
            treeNodeLabelProp={"display"}
            switcherIcon={<DownOutlined />}
        />
    )
}
