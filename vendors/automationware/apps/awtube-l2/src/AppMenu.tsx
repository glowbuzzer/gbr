/**
 * Application menu used by the examples, and demonstrates how to build a simple menu for your own application.
 *
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Menu } from "antd"
import {
    GbcVersionPanel,
    PreferencesDialog,
    useDockLayoutContext,
    useDockViewMenu,
    useGbdbMenu
} from "@glowbuzzer/controls"
import styled from "styled-components"
import React, { useState } from "react"
import { ItemType } from "antd/es/menu/hooks/useItems"

const StyledMenuBar = styled.div`
    display: flex;

    svg {
        border-bottom: 1px solid ${props => props.theme.colorBorder};
    }

    .title,
    .perspective-title {
        font-size: 1.5em;
        padding: 10px 10px 0 14px;

        span {
            display: inline-block;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            background: rgba(17, 0, 255, 0.13);
            padding: 2px 12px 3px 12px;
            font-size: 0.8em;
            border-radius: 15px;
        }
    }

    .title,
    .perspective-title,
    .version-info {
        border-bottom: 1px solid ${props => props.theme.colorBorder};
        display: inline-block;
    }

    .ant-menu {
        flex-grow: 1;
    }
`

export const AppMenu = ({ title = null }) => {
    const { perspectives, currentPerspective, changePerspective } = useDockLayoutContext()
    const { menuItems: projectMenu, menuContext: projectMenuContext } = useGbdbMenu("project")
    const { menuItems: cellMenu, menuContext: cellMenuContext } = useGbdbMenu("cell")

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
                ...projectMenu
            ]
        },
        {
            key: "cell",
            label: "Cell",
            children: cellMenu
        }
    ]
    menuItems.push(viewMenu)

    return (
        <StyledMenuBar>
            <>
                {/* Modals */}
                {projectMenuContext}
                {cellMenuContext}
                <PreferencesDialog open={showPrefs} onClose={() => setShowPrefs(false)} />
            </>

            {title && <div className="title">{title}</div>}
            <Menu mode="horizontal" theme="light" selectedKeys={[]} items={menuItems} />
            <GbcVersionPanel />
        </StyledMenuBar>
    )
}
