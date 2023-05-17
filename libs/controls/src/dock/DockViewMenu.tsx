/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Menu, Space } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import { useDockLayoutContext, useDockTiles } from "./hooks"
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems"
import { useGlowbuzzerTheme } from "../app/GlowbuzzerThemeProvider"

/**
 * This component renders a sub-menu containing available tiles and allows the user to show or hide them. It should be used in conjunction with
 * a surrounding Ant Design menu as shown in the example below.
 *
 * ```jsx
 * <Menu mode="horizontal" theme="light" selectedKeys={[]}>
 *     <Menu.SubMenu title="File" key="file">
 *         <Menu.Item key="file-preferences" onClick={() => setShowPrefs(true)}>
 *             Preferences
 *         </Menu.Item>
 *     </Menu.SubMenu>
 *     <!-- add the dock view menu -->
 *     <DockViewMenu />
 * </Menu>
 * ```
 */
export const useDockViewMenu = () => {
    const { showTile, resetLayout } = useDockLayoutContext()
    const { darkMode, setDarkMode } = useGlowbuzzerTheme()

    const tiles = useDockTiles()

    function toggle_dark_mode() {
        setDarkMode(!darkMode)
    }

    const tileItems: ItemType[] = tiles.map(tile => ({
        key: tile.id,
        disabled: tile.enableClose === false,
        icon: tile.visible ? <CheckOutlined /> : null,
        onClick: () => showTile(tile.id, !tile.visible),
        label: tile.name
    }))

    return {
        key: "view-menu",
        label: "View",
        children: [
            {
                key: "view-menu-tools",
                label: "Tools",
                children: tileItems
            },
            {
                type: "divider"
            },
            {
                key: "dark-mode",
                label: "Dark Mode",
                icon: darkMode ? <CheckOutlined /> : null,
                onClick: toggle_dark_mode
            },
            {
                key: "reset-layout",
                label: "Reset Layout",
                onClick: resetLayout
            }
        ]
    }
}

export const DockViewMenu = () => {
    // render antd menu which toggles visibility of the dock components
    const { showTile, resetLayout } = useDockLayoutContext()
    const { darkMode, setDarkMode } = useGlowbuzzerTheme()

    const tiles = useDockTiles()

    function toggle_dark_mode() {
        setDarkMode(!darkMode)
    }

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
            <Menu.Item key="dark-mode" onClick={toggle_dark_mode} defaultChecked={true}>
                <Space>
                    Dark Mode
                    {darkMode && <CheckOutlined />}
                </Space>
            </Menu.Item>
            <Menu.Item key="reset-layout" onClick={resetLayout}>
                Reset Layout
            </Menu.Item>
        </Menu.SubMenu>
    )
}
