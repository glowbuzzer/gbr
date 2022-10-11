/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useContext, useState } from "react"
import { GlowbuzzerDockLayoutContext } from "./GlowbuzzerDockLayoutProvider"
import { Layout } from "flexlayout-react"
import { TabNode } from "flexlayout-react/src/model/TabNode"
import { Modal } from "antd"
import { SettingOutlined } from "@ant-design/icons"

const SettingsModal = ({ children, title }) => {
    const [visible, setVisible] = useState(false)

    return (
        <>
            <SettingOutlined onClick={() => setVisible(true)} />
            <Modal visible={visible} onCancel={() => setVisible(false)} title={title}>
                {children}
            </Modal>
        </>
    )
}

export const GlowbuzzerDockLayout = () => {
    const { model, factory, buttonsFactory, settingsFactory, headerFactory, updateModel } =
        useContext(GlowbuzzerDockLayoutContext)

    return (
        <Layout
            model={model}
            factory={factory}
            font={{ size: "12px" }}
            realtimeResize={true}
            onModelChange={updateModel}
            onRenderTabSet={(node, renderValues) => {
                const selectedNode = node.getSelectedNode()
                // console.log("selectedNode", selectedNode.getId(), settingsFactory)
                if (selectedNode.getType() === "tab") {
                    const tab = selectedNode as TabNode
                    const settings = settingsFactory(tab)
                    const buttons = buttonsFactory(tab)
                    if (buttons) {
                        renderValues.buttons.push(<span>{buttons}</span>)
                    }

                    if (settings) {
                        renderValues.buttons.push(
                            <SettingsModal
                                key={tab.getId()}
                                children={settings}
                                title={tab.getName() + " Settings"}
                            />
                        )
                    }

                    const header = headerFactory(tab)
                    header &&
                        renderValues.stickyButtons.push(<span key={tab.getId()}>{header}</span>)
                }
                // const selected = node.getSelectedNode()
                // renderValues.headerButtons.push(<div>Y</div>)
                // renderValues.stickyButtons.push(<div>Z</div>)
                // renderValues.centerContent = <div>C</div>
                // renderValues.headerContent = <div>H</div>
            }}
        />
    )
}
