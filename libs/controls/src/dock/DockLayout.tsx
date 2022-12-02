/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createElement, Suspense, useContext, useState } from "react"
import { Popover } from "antd"
import { DockLayoutContext } from "./DockLayoutContext"
import { Layout, TabNode } from "flexlayout-react"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as SettingsIcon } from "@material-symbols/svg-400/outlined/settings.svg"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { useConnection } from "@glowbuzzer/store"

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

    function connection_aware_factory(node: TabNode) {
        const tile = factory(node)
        if (connection.connected || node.getConfig()?.enableWithoutConnection) {
            return <Suspense>{tile}</Suspense>
        }
        return (
            <Suspense>
                {tile}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        // background: "rgba(255,210,127,0.47)"
                        backgroundImage:
                            "linear-gradient(135deg, #ff6666 3.85%, #f0f0f0 3.85%, #f0f0f0 50%, #ff6666 50%, #ff6666 53.85%, #f0f0f0 53.85%, #f0f0f0 100%)",
                        backgroundSize: "6px 6px",
                        opacity: "0.2"
                    }}
                />
            </Suspense>
        )
    }

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
            factory={connection_aware_factory}
            font={{ size: "12px" }}
            realtimeResize={true}
            onModelChange={updateModel}
            onRenderTabSet={render_tab_set}
        />
    )
}
