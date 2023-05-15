/**
 * Application menu used by the examples, and demonstrates how to build a simple menu for your own application.
 *
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Menu } from "antd"
import { DockViewMenu, PreferencesDialog, useDockLayoutContext } from "@glowbuzzer/controls"
import { ReactComponent as Logo } from "../../images/tiny-logo.svg"
import styled from "styled-components"
import React, { useState } from "react"

const StyledMenuBar = styled.div`
    display: flex;

    svg {
        border-bottom: 1px solid ${props => props.theme.colorBorder};
    }

    .title,
    .perspective-title {
        font-size: 1.5em;
        display: inline-block;
        padding: 10px 10px 0 14px;
        border-bottom: 1px solid ${props => props.theme.colorBorder};

        span {
            display: inline-block;
            outline: 1px solid rgba(0, 0, 0, 0.2);
            background: rgba(17, 0, 255, 0.13);
            padding: 2px 12px 3px 12px;
            font-size: 0.8em;
            border-radius: 15px;
        }
    }

    .ant-menu {
        flex-grow: 1;
    }
`

export const ExampleAppMenu = ({ title = null }) => {
    const { perspectives, currentPerspective, changePerspective } = useDockLayoutContext()

    const [showPrefs, setShowPrefs] = useState(false)

    // title for current perpsective (undefined if there is only a single perspective)
    const perspectiveTitle =
        perspectives.length > 1 && perspectives.find(p => p.id === currentPerspective)?.name

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
            <Menu mode="horizontal" theme="light" selectedKeys={[]}>
                <Menu.SubMenu title="File" key="file">
                    <Menu.Item key="file-preferences" onClick={() => setShowPrefs(true)}>
                        Preferences
                    </Menu.Item>
                </Menu.SubMenu>
                {perspectives.length > 1 && (
                    <Menu.SubMenu title="Perspective" key="perspective">
                        {perspectives.map(perspective => (
                            <Menu.Item
                                key={perspective.id}
                                onClick={() => changePerspective(perspective.id)}
                            >
                                {perspective.name}
                            </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                )}
                <DockViewMenu />
            </Menu>
        </StyledMenuBar>
    )
}
