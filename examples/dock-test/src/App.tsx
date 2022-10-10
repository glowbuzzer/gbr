/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    GlowbuzzerDockComponent,
    GlowbuzzerDockLayoutProvider
} from "./dock/GlowbuzzerDockLayoutProvider"
import { Button, Space } from "antd"
import { GlowbuzzerDockLayout } from "./dock/GlowbuzzerDockLayout"
import { GlowbuzzerDockComponentsMenu } from "./dock/GlowbuzzerDockComponentsMenu"

export const App = () => {
    return (
        <GlowbuzzerDockLayoutProvider exclude={[GlowbuzzerDockComponent.ANALOG_INPUTS]}>
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
