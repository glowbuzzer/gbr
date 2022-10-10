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
    Actions,
    DockLocation,
    IJsonModel,
    IJsonTabNode,
    Layout,
    Model,
    TabNode
} from "flexlayout-react"

function id() {
    return Math.random().toString(36).substring(2, 9)
}

const JOGGING_TAB: IJsonTabNode = {
    type: "tab",
    id: "jogging",
    name: "Jogging"
}

const TOOLPATH_TAB: IJsonTabNode = {
    type: "tab",
    id: "toolpath",
    name: "Toolpath"
}

// used to add nodes back into the layout after they've been closed
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
                        enableDrop: false, // don't allow tabs to be added here
                        children: [
                            {
                                type: "tab",
                                id: "connect",
                                name: "Connect",
                                enableDrag: false, // don't allow connect tile to be moved
                                enableClose: false // or closed!
                            }
                        ],
                        active: true
                    },
                    {
                        type: "tabset",
                        id: id(),
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
        switch (node.getId()) {
            case "connect":
                return <ConnectTile />
            case "jogging":
                return <JogTile />
            case "toolpath":
                return <ToolPathTile />
        }
    }

    function toggle_tab(id: string, visible: boolean) {
        function determine_parent_id() {
            switch (id) {
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
            model.doAction(Actions.deleteTab(id))
        } else {
            const { id: parent_id, created } = determine_parent_id()
            model.doAction(
                Actions.addNode(COMPONENT_TAB_LOOKUP[id], parent_id, DockLocation.CENTER, -1)
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
                    const visible = !!model.getNodeById(id)
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
