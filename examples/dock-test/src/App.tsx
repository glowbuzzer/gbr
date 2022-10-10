/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    GlowbuzzerDockComponent,
    GlowbuzzerDockComponentDefinition,
    GlowbuzzerDockComponentSet,
    GlowbuzzerDockLayoutProvider
} from "./dock/GlowbuzzerDockLayoutProvider"
import { Button, Space } from "antd"
import { GlowbuzzerDockLayout } from "./dock/GlowbuzzerDockLayout"
import { GlowbuzzerDockComponentsMenu } from "./dock/GlowbuzzerDockComponentsMenu"

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
            components={CUSTOM_COMPONENTS}
            include={GlowbuzzerDockComponentSet.ALL}
            exclude={[GlowbuzzerDockComponent.ANALOG_INPUTS]}
        >
            <div>
                <Space>
                    <Button>OTHER MENUS HERE</Button>
                    <GlowbuzzerDockComponentsMenu />
                </Space>
            </div>
            <GlowbuzzerDockLayout />
        </GlowbuzzerDockLayoutProvider>
    )
}
