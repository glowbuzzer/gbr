/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Menu } from "antd"
import { DockViewMenu, useDockLayoutContext } from "@glowbuzzer/controls"
import React from "react"

export const AppMenu = () => {
    const { changePerspective } = useDockLayoutContext()

    return (
        <Menu mode="horizontal">
            <Menu.SubMenu title="File" key="file">
                <Menu.Item key="settings">Settings</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Perspective" key="perspective">
                <Menu.Item key="commissioning" onClick={() => changePerspective("commissioning")}>
                    Commissioning
                </Menu.Item>
                <Menu.Item key="development" onClick={() => changePerspective("development")}>
                    Development
                </Menu.Item>
            </Menu.SubMenu>
            <DockViewMenu />
        </Menu>
    )
}
