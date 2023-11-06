/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { GlowbuzzerApp } from "@glowbuzzer/controls"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { config } from "./config"
import { App } from "./app"

console.log(JSON.stringify(config, null, 2))

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName="aware-1408-32-32-25-20-17-17" configuration={config}>
        <App />
    </GlowbuzzerApp>
)
