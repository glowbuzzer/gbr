/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { createRef, StrictMode, useMemo, useState } from "react"
import { ConnectTile, GlowbuzzerApp, JogTile, ToolPathTile } from "@glowbuzzer/controls"

import "antd/dist/antd.css"
import "dseg/css/dseg.css"
import "flexlayout-react/style/light.css"

import { createRoot } from "react-dom/client"
import styled from "styled-components"
import { Button, Checkbox } from "antd"

import {
    IJsonModel,
    Layout,
    Model,
    TabNode,
    Node,
    Actions,
    DockLocation,
    IJsonTabNode
} from "flexlayout-react"
import { useLocalStorage } from "../../../libs/controls/src/util/LocalStorageHook"
import { DockLayout } from "rc-dock"

function id() {
    return Math.random().toString(36).substring(2, 9)
}

const JOGGING_TAB: IJsonTabNode = {
    type: "tab",
    id: id(),
    name: "Jogging",
    component: "jogging"
}

const TOOLPATH_TAB: IJsonTabNode = {
    type: "tab",
    id: id(),
    name: "Toolpath",
    component: "toolpath"
}

const COMPONENT_TAB_LOOKUP = {
    jogging: JOGGING_TAB,
    toolpath: TOOLPATH_TAB
}

const DEFAULT_MODEL: IJsonModel = {
    global: {
        tabSetEnableMaximize: false
    },
    borders: [],
    layout: {
        type: "row",
        id: id(),
        children: [
            {
                type: "row",
                weight: 30,
                children: [
                    {
                        type: "tabset",
                        id: "connect-solo",
                        weight: 31.723315444245678,
                        enableDrop: false,
                        children: [
                            {
                                type: "tab",
                                id: id(),
                                name: "Connect",
                                enableDrag: false,
                                enableClose: false,
                                component: "connect"
                            }
                        ],
                        active: true
                    },
                    {
                        type: "tabset",
                        id: id(),
                        weight: 31.723315444245678,
                        children: [JOGGING_TAB],
                        active: true
                    }
                ]
            },
            {
                type: "tabset",
                id: "main",
                weight: 70,
                enableDeleteWhenEmpty: false,
                children: [TOOLPATH_TAB]
            }
        ]
    }
}

const StyledApp = styled.div`
    padding: 10px;
    display: flex;
    gap: 10px;
    position: absolute;
    flex-direction: column;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;

    .flexlayout__layout {
        position: relative;
        flex-grow: 1;
        border: 1px solid rgba(128, 128, 128, 0.27);
    }
`

export function App() {
    // toggle next line comment to use local storage to save layout (annoying while developing!)
    // const [modelJson, setModelJson] = useLocalStorage<IJsonModel>("layout", DEFAULT_MODEL)
    const [modelJson, setModelJson] = useState<IJsonModel>(DEFAULT_MODEL)
    const model = useMemo(() => Model.fromJson(modelJson), [modelJson])
    const layoutRef = createRef<Layout>() // has a couple of extra methods, currently unused

    function updateModel(model: Model) {
        setModelJson(model.toJson())
    }

    function factory(node: TabNode) {
        switch (node.getComponent()) {
            case "connect":
                return <ConnectTile />
            case "jogging":
                return <JogTile />
            case "toolpath":
                return <ToolPathTile />
        }
    }

    function find_component(node: Node, component: string) {
        // depth first search
        if (node instanceof TabNode && node.getComponent() === component) {
            return node
        }
        for (const child of node.getChildren()) {
            const found = find_component(child, component)
            if (found) {
                return found
            }
        }
    }

    function toggle_tab(component: string, visible: boolean) {
        function determine_parent_id() {
            switch (component) {
                case "toolpath":
                    return { id: "main", created: false }
                default:
                    // try to find second tabset of first row
                    const first_col = model.getRoot().getChildren()[0]
                    if (first_col.getChildren().length < 2) {
                        model.doAction(
                            Actions.addNode(
                                "tabset",
                                first_col.getId(),
                                DockLocation.BOTTOM,
                                -1,
                                true
                            )
                        )
                        return {
                            id: model.getRoot().getChildren()[0].getChildren()[1].getId(),
                            created: true
                        }
                    }
                    return { id: first_col.getChildren()[1].getId(), created: false }
            }
        }

        if (visible) {
            const node: TabNode = find_component(model.getRoot(), component)
            model.doAction(Actions.deleteTab(node.getId()))
        } else {
            const { id: parent_id, created } = determine_parent_id()
            model.doAction(
                Actions.addNode(COMPONENT_TAB_LOOKUP[component], parent_id, DockLocation.CENTER, -1)
            )
            if (created) {
                // remove the empty tab that was added when tabset was added!
                const tabset = model.getNodeById(parent_id)
                model.doAction(Actions.deleteTab(tabset.getChildren()[0].getId()))
            }
        }
    }

    return (
        <StyledApp>
            <div>
                <Button>MENU GOES HERE</Button>
                {["jogging", "toolpath"].map(id => {
                    const node: TabNode = find_component(model.getRoot(), id)
                    const visible = !!node
                    return (
                        <Checkbox
                            key={id}
                            checked={visible}
                            onChange={() => toggle_tab(id, visible)}
                        >
                            {id}
                        </Checkbox>
                    )
                })}
            </div>
            <Layout
                ref={layoutRef}
                model={model}
                factory={factory}
                onModelChange={updateModel}
                realtimeResize={true}
                onTabSetPlaceHolder={() => <div>PLACEHOLDER FOR EMPTY TAB SET</div>}
            />
        </StyledApp>
    )
}

const root = createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <GlowbuzzerApp>
            <App />
        </GlowbuzzerApp>
    </StrictMode>
)
