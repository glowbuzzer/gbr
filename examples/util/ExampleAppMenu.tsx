/**
 * Application menu used by the examples, and demonstrates how to build a simple menu for your own application.
 *
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Menu } from "antd"
import { PreferencesDialog, useDockLayoutContext, useDockViewMenu } from "@glowbuzzer/controls"
import { ReactComponent as Logo } from "../../images/tiny-logo.svg"
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

export const ExampleAppMenu = ({ title = null, fileExtra = [] }) => {
    const { perspectives, currentPerspective, changePerspective } = useDockLayoutContext()
    const viewMenu = useDockViewMenu()

    const [showPrefs, setShowPrefs] = useState(false)

    // title for current perpsective (undefined if there is only a single perspective)
    const perspectiveTitle =
        perspectives.length > 1 && perspectives.find(p => p.id === currentPerspective)?.name

    const menuItems: ItemType[] = [
        {
            key: "file",
            label: "File",
            children: [
                {
                    key: "file-preferences",
                    label: "Preferences",
                    onClick: () => setShowPrefs(true)
                },
                ...fileExtra
            ]
        }
    ]
    if (perspectives.length > 1) {
        menuItems.push({
            key: "perspective",
            label: "Perspective",
            children: perspectives.map(perspective => ({
                key: perspective.id,
                label: perspective.name,
                onClick: () => changePerspective(perspective.id)
            }))
        })
    }
    menuItems.push(viewMenu)

    return (
        <StyledMenuBar>
            <PreferencesDialog open={showPrefs} onClose={() => setShowPrefs(false)} />
            <Logo width={40} />
            {title && <div className="title">{title}</div>}
            {perspectiveTitle && (
                <div className="perspective-title">
                    <span>{perspectiveTitle}</span>
                </div>
            )}
            <Menu mode="horizontal" theme="light" selectedKeys={[]} items={menuItems} />
        </StyledMenuBar>
    )
}
