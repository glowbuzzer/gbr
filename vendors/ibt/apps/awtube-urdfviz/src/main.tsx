/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { GlowbuzzerApp } from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config_awtube_l2 } from "./config"
import { App } from "./app"
import { ModelProvider, useAwTubeModel } from "./model/ModelProvider"

const root = createRoot(document.getElementById("root"))

const ConfigSwitcher = () => {
    const { config } = useAwTubeModel()

    return (
        <GlowbuzzerApp appName="aware-urdfviz"
                       // configuration={config}
        >
            <App />
        </GlowbuzzerApp>
    )
}

root.render(
    <ModelProvider>
        <ConfigSwitcher />
    </ModelProvider>
)
