/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Actions, Model } from "flexlayout-react"
import * as React from "react"
import { ReactNode, useMemo, useState } from "react"
import styled from "styled-components"
import { TabNode } from "flexlayout-react/src/model/TabNode"
import {
    GlowbuzzerDockComponent,
    GlowbuzzerDockStandardComponentList
} from "./GlowbuzzerDockStandardComponentList"
import { GlowbuzzerDockComponentSet } from "./GlowbuzzerDockComponentSet"
import { GlowbuzzerDockModelTemplate } from "./GlowbuzzerDockModelTemplate"
import { GlowbuzzerDockComponentDefinition } from "./GlowbuzzerDockComponentDefinition"
import {
    GlowbuzzerDockLayoutContext,
    GlowbuzzerDockLayoutContextType
} from "./GlowbuzzerDockLayoutContext"
import { add_component } from "./util"
import { useLocalStorage } from "../util/LocalStorageHook"

const StyledDiv = styled.div`
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

    .flexlayout__tab_button--selected {
        background: none;
        border-bottom: 1px solid #1890ff;
    }

    .help-popover {
        visibility: hidden;
    }

    .flexlayout__tabset-selected {
        .flexlayout__tab_button--selected {
            background-color: var(--color-tab-selected-background);
            border-bottom: none;
        }

        .help-popover {
            visibility: visible;
        }
    }
`

type GlowbuzzerDockLayoutProps = {
    appName: string
    components?: (Partial<GlowbuzzerDockComponentDefinition> & { id: string })[]
    include?: GlowbuzzerDockComponent[] | GlowbuzzerDockComponentSet
    exclude?: string[]
    children: ReactNode
}

export const GlowbuzzerDockLayoutProvider = ({
    appName,
    components: configuredComponents,
    include = GlowbuzzerDockComponentSet.ALL,
    exclude,
    children
}: GlowbuzzerDockLayoutProps) => {
    const [savedLayout, updateSavedLayout] = useLocalStorage("docklayout", null, appName)

    const { currentModel, defaultModel, components } = useMemo(() => {
        // take the components passed in and merge with defaults from the standard components
        const merged = [
            ...(configuredComponents ?? []),
            ...(include
                ? GlowbuzzerDockStandardComponentList.filter(c =>
                      include === GlowbuzzerDockComponentSet.ALL
                          ? true
                          : include.includes(c.id as GlowbuzzerDockComponent)
                  )
                : [
                      /* don't include any stnadard components */
                  ])
        ]
        const components = Object.fromEntries(
            merged
                .filter((c, i, a) => a.findIndex(c2 => c2.id === c.id) === i) // distinct
                .filter(c => !exclude?.includes(c.id)) // remove excluded components
                .map(c => [
                    c.id,
                    {
                        ...(GlowbuzzerDockStandardComponentList.find(
                            component => component.id === c.id
                        ) ?? {}),
                        ...c
                    }
                ])
        )

        const { connect: configuredConnect, ...otherComponents } = components
        // we insist there is a connect tile
        if (!configuredConnect) {
            components.connect = GlowbuzzerDockStandardComponentList.find(
                c => c.id === GlowbuzzerDockComponent.CONNECT
            )
        }

        // take a copy for modification
        const modelJson = JSON.parse(JSON.stringify(GlowbuzzerDockModelTemplate))
        // add the solo connect tile to the first column
        modelJson.layout.children[0].children[0].children.push({
            type: "tab",
            ...components.connect
        })

        for (const component of Object.values(otherComponents)) {
            add_component(modelJson, component)
        }
        return {
            components,
            currentModel: Model.fromJson({ ...modelJson, ...savedLayout }),
            defaultModel: Model.fromJson(modelJson)
        }
    }, [configuredComponents])

    const [model, updateModelInternal] = useState(currentModel)

    function updateModel(model: Model) {
        updateModelInternal(model)
        updateSavedLayout({ layout: model.toJson().layout })
    }

    function resetLayout() {
        updateModel(defaultModel)
    }

    const context: GlowbuzzerDockLayoutContextType = {
        components,
        model,
        resetLayout,
        factory: (node: TabNode) => {
            const component = components[node.getId()]
            return component?.factory()
        },
        settingsFactory: (node: TabNode) => {
            const component = components[node.getId()]
            return component?.settingsFactory?.()
        },
        headerFactory: (node: TabNode) => {
            const component = components[node.getId()]
            return component?.headerFactory?.()
        },
        buttonsFactory: (node: TabNode) => {
            const component = components[node.getId()]
            return component?.buttonsFactory?.()
        },
        helpFactory: (node: TabNode) => {
            const component = components[node.getId()]
            return component?.helpFactory?.()
        },
        updateModel: new_model => {
            // model object is not changed, so we need to force a re-render
            updateModel(Model.fromJson(new_model.toJson()))
        },

        showComponent(id: string, show: boolean = false) {
            if (!show) {
                model.doAction(Actions.deleteTab(id))
            } else {
                const existing = model.getNodeById(id)
                if (existing) {
                    model.doAction(Actions.selectTab(id))
                } else {
                    // tab was closed so we need to add it back in
                    const component = components[id]
                    if (!component) {
                        throw new Error(`No component with id ${id}`)
                    }
                    const modelJson = model.toJson()
                    add_component(modelJson, component)
                    const new_model = Model.fromJson(modelJson)
                    new_model.doAction(Actions.selectTab(id))
                    updateModel(new_model)
                }
            }
        }
    }

    return (
        <StyledDiv>
            <GlowbuzzerDockLayoutContext.Provider value={context}>
                {children}
            </GlowbuzzerDockLayoutContext.Provider>
        </StyledDiv>
    )
}
