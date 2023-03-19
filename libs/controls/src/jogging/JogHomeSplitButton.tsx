/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { ReactComponent as HomeIcon } from "@material-symbols/svg-400/outlined/home.svg"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { DownOutlined } from "@ant-design/icons"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { useFramesList, usePoints, useSoloActivity } from "@glowbuzzer/store"
import { Dropdown, Menu } from "antd"
import styled from "styled-components"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"

const StyledMenu = styled(Menu)`
    ${CssPointNameWithFrame}
`

const StyledDownOutlined = styled(DownOutlined)`
    display: inline-block;
    transform: translate(0, -3px);
    cursor: pointer;
    color: #bfbfbf;
`

/** @ignore - internal to the jog tile */
export const JogHomeSplitButton = ({ kinematicsConfigurationIndex, frameIndex }) => {
    const points = usePoints()
    const frames = useFramesList()
    const motion = useSoloActivity(kinematicsConfigurationIndex)

    function go(point) {
        // we'll use the currently selected frame if none is specified by the point
        return motion.moveToPosition().frameIndex(frameIndex).setFromPoint(point).promise()
    }

    function go_home() {
        return go(points[0])
    }

    if (!points.length) {
        return null
    }

    // convert points to antd menu items
    const items = points.map((point, index) => ({
        key: index,
        label: (
            <div className="point-name">
                <div className="name">{point.name}</div>
                {frames[point.frameIndex] && (
                    <div className="frame">
                        <FramesIcon
                            width={13}
                            height={13}
                            viewBox="0 0 48 48"
                            transform="translate(0,2)"
                        />{" "}
                        {frames[point.frameIndex].name}
                    </div>
                )}
            </div>
        ),
        onClick: () => go(point)
    }))

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon Icon={HomeIcon} button onClick={go_home} />
            <Dropdown trigger={["click"]} overlay={<StyledMenu items={items} />}>
                <StyledDownOutlined />
            </Dropdown>
        </DockToolbarButtonGroup>
    )
}
