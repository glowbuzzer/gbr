/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode, useState } from "react"
import { ConnectTile, GlowbuzzerApp, JogTile, ToolPathTile } from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "rc-dock/dist/rc-dock.css"

import { createRoot } from "react-dom/client"
import { DockLayout, LayoutData, TabGroup } from "rc-dock"
import styled from "styled-components"
import { Button } from "antd"

const defaultLayout: LayoutData = {
    dockbox: {
        mode: "horizontal",
        children: [
            {
                size: 200,
                group: "default",
                tabs: [
                    {
                        id: "connect",
                        title: "Connect",
                        content: <ConnectTile />
                    },
                    {
                        id: "jog",
                        title: "Jogging",
                        content: <JogTile />
                    }
                ]
            },
            {
                size: 1000,
                tabs: [
                    {
                        id: "tab2",
                        title: "Tab 2",
                        content: <ToolPathTile />
                    }
                ]
            }
        ]
    },
    floatbox: {
        mode: "horizontal",
        children: [
            {
                group: "default",
                tabs: [
                    {
                        id: "frames",
                        title: "Frames",
                        content: <div>THIS IS FRAMES!</div>
                    }
                ]
            }
        ]
    }
}

const tabGroups: { [key: string]: TabGroup } = {
    default: {
        maximizable: false
    }
}

const StyledApp = styled.div`
    padding: 10px;
    display: flex;
    gap: 10px;
    position: absolute;
    flex-direction: column;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;

    .dock-layout {
        flex-grow: 1;
    }
`

export function App() {
    return (
        <StyledApp>
            <div>
                <Button>MENU GOES HERE</Button>
            </div>
            <DockLayout defaultLayout={defaultLayout} groups={tabGroups} />
        </StyledApp>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
