/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useActiveFrame, useFramesList } from "@glowbuzzer/store"
import { Select } from "antd"
import { ReactComponent as WorkOffsetIcon } from "@material-symbols/svg-400/outlined/flip_to_back.svg"
import styled from "styled-components"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"

const StyledDiv = styled.div`
    padding-right: 1px;

    ${CssPointNameWithFrame}
`

export const GCodeWorkOffsetSelect = () => {
    const frames = useFramesList()
    const [active, setActiveFrame] = useActiveFrame()

    // we currently only support 6 work offsets G54-G59
    const items = Array.from({ length: 6 }).map((_, i) => {
        // try to find frame index (we will take the first one if there are duplicates)
        const frameIndex = frames.findIndex(f => f.workspaceOffset === i + 1)
        const disabled = frameIndex === -1
        return {
            key: i,
            value: i,
            label: (
                <StyledDiv>
                    <div className="workspace-offset-name">
                        <div className="name">G{54 + i}</div>
                        {disabled || (
                            <div className="frame">
                                <FramesIcon
                                    width={13}
                                    height={13}
                                    viewBox="0 0 48 48"
                                    transform="translate(0,2)"
                                />{" "}
                                {frames[frameIndex].name}
                            </div>
                        )}
                    </div>
                </StyledDiv>
            ),
            display: (
                <div>
                    <WorkOffsetIcon
                        width={16}
                        height={16}
                        viewBox="0 0 48 48"
                        transform="translate(0,2)"
                    />{" "}
                    G{54 + i}
                </div>
            ),
            disabled
        }
    })

    return (
        <>
            {/*
            <Dropdown trigger={["click"]} overlay={<StyledMenu items={items} optionLabelProp="display" />}>
                <StyledDownOutlined />
            </Dropdown>
*/}
            <Select
                size="small"
                options={items}
                value={active}
                onChange={setActiveFrame}
                optionLabelProp="display"
                bordered={false}
                dropdownMatchSelectWidth={false}
            />
        </>
    )
}
