import * as React from "react"
import { createRoot } from "react-dom/client"

import "@ant-design/v5-patch-for-react-19"
import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { App } from "./App"
import { SceneWithControls } from "./SceneWithControls"

const root = createRoot(document.getElementById("root"))
root.render(<App />)
