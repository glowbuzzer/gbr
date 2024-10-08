/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { ReactComponent as HomeIcon } from "@material-symbols/svg-400/outlined/home.svg"
import { ReactComponent as FramesIcon } from "@material-symbols/svg-400/outlined/account_tree.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { DownOutlined } from "@ant-design/icons"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { PointsConfig, useFramesList, usePointsList, useSoloActivity } from "@glowbuzzer/store"
import { Dropdown } from "antd"
import styled from "styled-components"
import { CssPointNameWithFrame } from "../util/styles/CssPointNameWithFrame"
import { ItemType } from "antd/es/menu/hooks/useItems"

const StyledMenuItem = styled.div`
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
    const points = usePointsList()
    const frames = useFramesList()
    const motion = useSoloActivity(kinematicsConfigurationIndex)

    function go(point: PointsConfig) {
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
    const items: ItemType[] = points.map((point, index) => ({
        key: index,
        label: (
            <StyledMenuItem>
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
            </StyledMenuItem>
        ),
        onClick: () => go(point)
    }))

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon useFill={true} Icon={HomeIcon} button onClick={go_home} />
            <Dropdown trigger={["click"]} menu={{ items }}>
                <StyledDownOutlined />
            </Dropdown>
        </DockToolbarButtonGroup>
    )
}
