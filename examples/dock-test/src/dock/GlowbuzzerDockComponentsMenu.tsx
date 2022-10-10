/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Dropdown, Menu } from "antd"
import { useGlowbuzzerDock, useGlowbuzzerDockComponents } from "./GlowbuzzerDockLayoutProvider"
import { CheckOutlined } from "@ant-design/icons"

export const GlowbuzzerDockComponentsMenu = () => {
    // render antd menu which toggles visibility of the dock components
    const components = useGlowbuzzerDockComponents()
    const { showComponent } = useGlowbuzzerDock()

    const items = components
        .filter(c => c.enableClose !== false)
        .map(component => ({
            key: component.id,
            label: (
                <span onClick={() => showComponent(component.id, !component.visible)}>
                    {component.name} {component.visible && <CheckOutlined />}
                </span>
            )
        }))

    return (
        <Dropdown overlay={<Menu items={items}></Menu>}>
            <Button>Tiles</Button>
        </Dropdown>
    )
}
