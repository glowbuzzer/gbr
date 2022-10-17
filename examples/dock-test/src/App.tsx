/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    GlowbuzzerDockComponent,
    GlowbuzzerDockComponentDefinition,
    GlowbuzzerDockComponentSet,
    GlowbuzzerDockViewMenu,
    GlowbuzzerDockLayout,
    GlowbuzzerDockLayoutProvider
} from "@glowbuzzer/controls"
import { Button, Space } from "antd"

const CUSTOM_COMPONENTS: GlowbuzzerDockComponentDefinition[] = [
    {
        id: "my-component",
        name: "My Component",
        factory(): React.ReactNode {
            return <div>My Component</div>
        }
    }
]

export const App = () => {
    return (
        <GlowbuzzerDockLayoutProvider
            appName="dock-test"
            components={CUSTOM_COMPONENTS}
            exclude={[GlowbuzzerDockComponent.ANALOG_INPUTS]}
        >
            <div>
                <Space>
                    <Button>OTHER MENUS HERE</Button>
                    <GlowbuzzerDockViewMenu />
                </Space>
            </div>
            <GlowbuzzerDockLayout />
        </GlowbuzzerDockLayoutProvider>
    )
}
