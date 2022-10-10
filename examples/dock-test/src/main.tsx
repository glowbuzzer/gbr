/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { StrictMode } from "react"
import { GlowbuzzerApp } from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

import { createRoot } from "react-dom/client"
import { App } from "./App"

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
