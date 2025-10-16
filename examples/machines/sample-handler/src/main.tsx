import * as React from "react"
import { createRoot } from "react-dom/client"

import "antd/dist/reset.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"
import { App } from "./App"
import { TestRawScene } from "./TestRawScene"

const root = createRoot(document.getElementById("root"))
root.render(<TestRawScene />)
