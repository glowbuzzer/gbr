import React from "react"
import ReactDOM from "react-dom"

import App from "./app/app"

ReactDOM.render(<App />, document.getElementById("root"))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const m = import.meta as any
if (m.hot) {
    m.hot.accept()
}
