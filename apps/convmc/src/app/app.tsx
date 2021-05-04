import React, { useState } from "react"
import "antd/dist/antd.css"
import { PreferencesDialog } from "@glowbuzzer/controls"
import { GlowbuzzerApp } from "@glowbuzzer/store"
import { Button, Menu } from "antd"
import { BrowserRouter, Link } from "react-router-dom"
import { Route } from "react-router"
import { CommissioningUi } from "./CommissioningUi"
import { DevelopmentUi } from "./DevelopmentUi"
import { digitalInputEnhancer, DigitalInputMockProvider } from "../enhancers/digitalInputEnhancer"
import { SoloActivityProvider } from "../components/TestMotionTile"

const PrefsButton = () => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <Button onClick={() => setVisible(true)}>Preferences</Button>
            <PreferencesDialog visible={visible} onClose={() => setVisible(false)} />
        </>
    )
}

export function App() {
    return (
        <GlowbuzzerApp minWidth={"1080px"} storeEnhancers={[digitalInputEnhancer]}>
            <DigitalInputMockProvider>
                <SoloActivityProvider>
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
                </SoloActivityProvider>
            </DigitalInputMockProvider>
        </GlowbuzzerApp>
    )
}

export default App
