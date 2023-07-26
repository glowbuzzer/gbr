import {DockLayout, DockLayoutProvider, GlowbuzzerTileDefinitionList, useDockViewMenu} from "@glowbuzzer/controls";
import {Menu} from "antd";
import * as React from "react";

const AppMenu = () => {
    const viewMenu = useDockViewMenu()
    return <Menu mode="horizontal" selectedKeys={[]} items={[viewMenu]}/>
}

export const App = () => {
    return <>
        <DockLayoutProvider tiles={GlowbuzzerTileDefinitionList}>
            <AppMenu/>
            <DockLayout/>
        </DockLayoutProvider>
    </>

}