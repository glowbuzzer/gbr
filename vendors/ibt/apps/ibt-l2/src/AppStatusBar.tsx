import styled from "styled-components"
import * as React from "react"
import { useState } from "react"
import {
    PreferencesDialog,
    StatusBarMenu,
    useDockViewMenu,
    useGbdbMenu
} from "@glowbuzzer/controls"
import { ItemType } from "antd/es/menu/hooks/useItems"

const StyledDiv = styled.div`
    flex-grow: 1;
    padding: 8px 30px 0 30px;

    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;

    .ant-menu {
        border-bottom: none;
        flex-grow: 1;
    }

    .ant-menu-horizontal {
        line-height: 30px;

        .ant-menu-submenu {
            //padding-inline: 0px;
        }
    }
`

export const AppStatusBar = () => {
    const { menuItems: projectMenu, menuContext: projectMenuContext } = useGbdbMenu("project")
    const viewMenu = useDockViewMenu()

    const [showPrefs, setShowPrefs] = useState(false)

    const menuItems: ItemType[] = [
        {
            key: "project",
            label: "Project",
            children: [
                {
                    key: "project-preferences",
                    label: "Preferences",
                    onClick: () => setShowPrefs(true)
                },
                {
                    key: "project-divider",
                    type: "divider"
                },
                ...(projectMenu as any)
            ]
        }
    ]
    menuItems.push(viewMenu)

    return (
        <StyledDiv>
            {projectMenuContext}
            <PreferencesDialog open={showPrefs} onClose={() => setShowPrefs(false)} />
            <StatusBarMenu mode="horizontal" selectedKeys={[]} items={menuItems} />
        </StyledDiv>
    )
}
