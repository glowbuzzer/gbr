/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"

import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { createRoot } from "react-dom/client"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { App } from "./App"

const root = createRoot(document.getElementById("root"))
root.render(
    <GlowbuzzerApp appName={"agv"}>
        <App />
    </GlowbuzzerApp>
)
