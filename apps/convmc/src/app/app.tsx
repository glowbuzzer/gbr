import React, { useState } from "react"
import { PreferencesDialog } from "@glowbuzzer/controls"
import { GlowbuzzerApp } from "@glowbuzzer/controls"
import { Button, Menu } from "antd"
import { BrowserRouter, Link } from "react-router-dom"
import { Route } from "react-router"
import { CommissioningUi } from "./CommissioningUi"
import { DevelopmentUi } from "./DevelopmentUi"
import { digitalInputEnhancer, DigitalInputMockProvider } from "@glowbuzzer/store"
import { SoloActivityProvider } from "../components/TestMotionTile"
import { AppContextProvider } from "./AppContext"

import "antd/dist/antd.css"

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <div>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </div>
    )
}

export function App() {
    return (
        <GlowbuzzerApp minWidth={"1080px"} storeEnhancers={[digitalInputEnhancer]}>
            <DigitalInputMockProvider>
                <SoloActivityProvider>
                    <AppContextProvider>
                        <BrowserRouter>
                            <Menu mode="horizontal">
                                <Menu.Item>
                                    <Link to="/">Commissioning</Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link to="/devel">Development</Link>
                                </Menu.Item>
                                <Menu.Item>HMI</Menu.Item>

                                <PrefsButton />
                            </Menu>
                            <Route path="/" exact={true} component={CommissioningUi} />
                            <Route path="/devel" exact={true} component={DevelopmentUi} />
                        </BrowserRouter>
                    </AppContextProvider>
                </SoloActivityProvider>
            </DigitalInputMockProvider>
        </GlowbuzzerApp>
    )
}

export default App