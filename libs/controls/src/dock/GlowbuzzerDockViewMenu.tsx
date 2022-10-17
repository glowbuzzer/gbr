/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Dropdown, Menu } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import { useGlowbuzzerDock, useGlowbuzzerDockComponents } from "./hooks"
import { ItemType } from "antd/es/menu/hooks/useItems"

export const GlowbuzzerDockViewMenu = () => {
    // render antd menu which toggles visibility of the dock components
    const components = useGlowbuzzerDockComponents()
    const { showComponent, resetLayout } = useGlowbuzzerDock()

    const items: ItemType[] = components
        .filter(c => c.enableClose !== false)
        .map(component => ({
            key: component.id,
            label: (
                <span onClick={() => showComponent(component.id, !component.visible)}>
                    {component.name} {component.visible && <CheckOutlined />}
                </span>
            )
        }))

    items.push({ type: "divider" })
    items.push({
        key: "reset",
        label: <span onClick={resetLayout}>Reset Layout</span>
    })

    return (
        <Dropdown overlay={<Menu items={items} />}>
            <Button>View</Button>
        </Dropdown>
    )
}
