import * as React from "react"
import { createRoot } from "react-dom/client"

import { Menu } from "antd"
import {
    DockLayout,
    DockLayoutProvider,
    DockViewMenu,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList
} from "@glowbuzzer/controls"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

const root = createRoot(document.getElementById("root")!)

root.render(
    <React.StrictMode>
        {/* GlowbuzzerApp provides the Redux store */}
        <GlowbuzzerApp appName={"myapp"}>
            {/* DockLayoutProvider gives the visual docking layout */}
            <DockLayoutProvider
                tiles={GlowbuzzerTileDefinitionList /* include all standard tiles */}
            >
                {/* Provide a view menu to show/hide tiles */}
                <Menu mode="horizontal" theme="light" selectedKeys={[]}>
                    <DockViewMenu />
                </Menu>
                {/* The actual docking layout */}
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    </React.StrictMode>
)
