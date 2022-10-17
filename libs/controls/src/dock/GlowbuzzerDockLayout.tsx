/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useContext, useState } from "react"
import { Modal, Popover } from "antd"
import { GlowbuzzerDockLayoutContext } from "./GlowbuzzerDockLayoutContext"
import { TabNode } from "flexlayout-react/src/model/TabNode"
import { Layout } from "flexlayout-react"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as SettingsIcon } from "@material-symbols/svg-400/outlined/settings.svg"
import styled from "styled-components"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { useConnection } from "@glowbuzzer/store"

const GlowbuzzerDockSettingsModal = ({ children, title }) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <GlowbuzzerIcon
                name="settings"
                Icon={SettingsIcon}
                button
                title="Settings"
                onClick={() => setVisible(true)}
            />
            <Modal visible={visible} onCancel={() => setVisible(false)} title={title}>
                {children}
            </Modal>
        </>
    )
}

export const GlowbuzzerDockLayout = () => {
    const {
        model,
        factory,
        buttonsFactory,
        settingsFactory,
        helpFactory,
        headerFactory,
        updateModel
    } = useContext(GlowbuzzerDockLayoutContext)

    const connection = useConnection()

    function connection_aware_factory(node: TabNode) {
        const component = factory(node)
        if (connection.connected || node.getConfig()?.enableWithoutConnection) {
            return component
        }
        return (
            <>
                {component}
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
            </>
        )
    }

    function render_tab_set(node, renderValues) {
        const selectedNode = node.getSelectedNode()
        if (selectedNode?.getType() === "tab") {
            const tab = selectedNode as TabNode

            const buttons = buttonsFactory(tab)
            buttons && renderValues.buttons.push(<>{buttons}</>)

            const settings = settingsFactory(tab)
            settings &&
                renderValues.buttons.push(
                    <GlowbuzzerDockSettingsModal
                        key={tab.getId()}
                        children={settings}
                        title={tab.getName() + " Settings"}
                    />
                )

            const help = helpFactory(tab)
            help &&
                renderValues.stickyButtons.push(
                    <Popover
                        className="help-popover"
                        key={tab.getId()}
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
