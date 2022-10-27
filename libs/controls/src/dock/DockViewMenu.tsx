/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Menu } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import { useDockLayoutContext, useDockTiles } from "./hooks"
import { MenuItemType } from "antd/es/menu/hooks/useItems"

export const DockViewMenu = () => {
    // render antd menu which toggles visibility of the dock components
    const { showTile, resetLayout } = useDockLayoutContext()
    const tiles = useDockTiles()

    const items: MenuItemType[] = tiles.map(tile => ({
        key: tile.id,
        disabled: tile.enableClose === false,
        label: (
            <span onClick={() => showTile(tile.id, !tile.visible)}>
                {tile.name} {tile.visible && <CheckOutlined />}
            </span>
        )
    }))

    return (
        <Menu.SubMenu title="View" key="view-menu">
            <Menu.SubMenu title="Tools" key="view-menu-tools">
                {items.map(item => {
                    const { label, ...rest } = item
                    return <Menu.Item {...rest}>{label}</Menu.Item>
                })}
            </Menu.SubMenu>
            <Menu.Divider />
            <Menu.Item key="reset-layout" onClick={resetLayout}>
                Reset Layout
            </Menu.Item>
        </Menu.SubMenu>
    )
}
