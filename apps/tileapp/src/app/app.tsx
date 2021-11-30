import React, { useState } from "react"

import { PreferencesDialog } from "@glowbuzzer/controls"
import styled from "@emotion/styled"

import "antd/dist/antd.css"
import "./app.css"
import { useTiles } from "@glowbuzzer/layout"

const StyledApp = styled.div``

export const App = () => {
    const { tiles, setVisible } = useTiles()
    const [showPreferences, setShowPreferences] = useState(false)

    return (
        <StyledApp>
            <PreferencesDialog
                visible={showPreferences}
                onClose={() => setShowPreferences(false)}
            />
        </StyledApp>
    )
}

export default App
