/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */
import * as React from "react"
import { ReactComponent as HomeIcon } from "@material-symbols/svg-400/outlined/home.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { DownOutlined } from "@ant-design/icons"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { usePoints, useSoloActivity } from "@glowbuzzer/store"
import { Dropdown, Menu } from "antd"
import styled from "styled-components"

const StyledDownOutlined = styled(DownOutlined)`
    display: inline-block;
    transform: translate(0, -3px);
    cursor: pointer;
    color: #bfbfbf;
`

export const JogHomeSplitButton = ({ kinematicsConfigurationIndex }) => {
    const points = usePoints()
    const motion = useSoloActivity(kinematicsConfigurationIndex)

    function go(point) {
        return motion.moveToPosition().setFromPoint(point).promise()
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
        label: point.name,
        onClick: () => go(point)
    }))

    return (
        <DockToolbarButtonGroup>
            <GlowbuzzerIcon Icon={HomeIcon} button onClick={go_home} />
            <Dropdown overlay={<Menu items={items} />}>
                <StyledDownOutlined />
            </Dropdown>
        </DockToolbarButtonGroup>
    )
}
