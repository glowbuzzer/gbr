/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useContext, useState } from "react"
import { Popover } from "antd"
import { DockLayoutContext } from "./DockLayoutContext"
import { Layout, TabNode } from "flexlayout-react"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as SettingsIcon } from "@material-symbols/svg-400/outlined/settings.svg"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { MachineState, useConnection, useMachineState } from "@glowbuzzer/store"
import { is_touch_device } from "./util"
import { useGlowbuzzerMode } from "../modes"

const DockTileSettingsModal = ({ Component }: { Component }) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <GlowbuzzerIcon
                key="settings-btn"
                name="settings"
                Icon={SettingsIcon}
                button
                title="Settings"
                onClick={() => setVisible(true)}
            />
            <Component key="settings" open={visible} onClose={() => setVisible(false)} />
        </>
    )
}

const ButtonsWrapper = ({ children }) => <>{children}</>

/**
 * This component renders the current layout, as defined by the current layout context (see {@link DockLayoutProvider}).
 */
export const DockLayout = () => {
    const {
        model,
        factory,
        buttonsFactory,
        settingsFactory,
        helpFactory,
        headerFactory,
        updateModel
    } = useContext(DockLayoutContext)

    const connection = useConnection()
    const { mode } = useGlowbuzzerMode()
    const machineState = useMachineState()
    const op = machineState === MachineState.OPERATION_ENABLED

    function render_tab_set(node, renderValues) {
        const selectedNode = node.getSelectedNode()
        if (selectedNode?.getType() === "tab") {
            const tab = selectedNode as TabNode

            const buttons = buttonsFactory(tab)
            buttons &&
                renderValues.buttons.push(<ButtonsWrapper key="buttons">{buttons}</ButtonsWrapper>)

            const settings = settingsFactory(tab)
            settings &&
                renderValues.buttons.push(
                    <DockTileSettingsModal key={tab.getId() + "-settings"} Component={settings} />
                )

            const help = helpFactory(tab)
            help &&
                renderValues.stickyButtons.push(
                    <Popover
                        className="help-popover"
                        key={tab.getId() + "-help"}
                        trigger="click"
                        content={help}
                        placement="bottomRight"
                    >
                        <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                    </Popover>
                )

            const header = headerFactory(tab)
            header && renderValues.stickyButtons.push(<span key={tab.getId()}>{header}</span>)
        }
    }

    if (!model) {
        return null
    }

    return (
        <Layout
            model={model}
            factory={(node: TabNode) => factory(node)}
            font={{ size: "12px" }}
            realtimeResize={!is_touch_device()}
            onModelChange={updateModel}
            onRenderTabSet={render_tab_set}
        />
    )
}
