import * as React from "react"

import {
    DockLayout,
    DockLayoutProvider,
    DockViewMenu,
    GlowbuzzerApp,
    GlowbuzzerTileDefinitionList
} from "@glowbuzzer/controls"

import "antd/dist/antd.min.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

/**
 * Change DockLayoutProvider.appName to ensure unique keys in local storage
 */

function App() {
    return (
        <GlowbuzzerApp>
            <DockLayoutProvider
                appName={"myapp"}
                tiles={GlowbuzzerTileDefinitionList /* include all standard tiles */}
            >
                <DockViewMenu />
                <DockLayout />
            </DockLayoutProvider>
        </GlowbuzzerApp>
    )
}

export default App
