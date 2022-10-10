/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Actions, IJsonModel, IJsonTabNode, Model } from "flexlayout-react"
import * as React from "react"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import {
    AnalogInputsTile,
    CartesianDroTile,
    ConnectTile,
    DigitalInputsTile,
    IntegerInputsTile,
    JogTile,
    ToolPathTile
} from "@glowbuzzer/controls"
import { SpindleTile } from "../../../../libs/controls/src/spindle/SpindleTile"
import styled from "styled-components"
import { TabNode } from "flexlayout-react/src/model/TabNode"

type GlowbuzzerDockLayoutContextType = {
    model: Model
    factory: (node: TabNode) => React.ReactNode
    components: { [index: string]: Partial<GlowbuzzerDockComponentDefinition> }
    updateModel(model: Model): void
    showComponent(id: string, show: boolean): void
}

export const GlowbuzzerDockLayoutContext = createContext<GlowbuzzerDockLayoutContextType>(null)

type GlowbuzzerDockPlacement = {
    column: number
    row: number
}

interface GlowbuzzerDockComponentDefinition extends IJsonTabNode {
    id: string

    factory(): ReactNode

    defaultPlacement?: GlowbuzzerDockPlacement
}

export enum GlowbuzzerDockComponent {
    CONNECT = "connect",
    JOGGING = "jogging",
    TOOLPATH = "toolpath",
    SPINDLE = "spindle",
    DIGITAL_INPUTS = "digital-inputs",
    ANALOG_INPUTS = "analog-inputs",
    INTEGER_INPUTS = "integer-inputs",
    CARTESIAN_DRO = "cartesian-dro"
}

const GLOWBUZZER_COMPONENTS: GlowbuzzerDockComponentDefinition[] = [
    {
        id: GlowbuzzerDockComponent.CONNECT,
        name: "Connect",
        enableDrag: false, // don't allow connect tile to be moved
        enableClose: false, // or closed!
        factory: () => <ConnectTile />
    },
    {
        id: GlowbuzzerDockComponent.JOGGING,
        name: "Jogging",
        defaultPlacement: {
            column: 0,
            row: 1
        },
        factory: () => <JogTile />
    },
    {
        id: GlowbuzzerDockComponent.TOOLPATH,
        name: "Toolpath",
        enableClose: false,
        defaultPlacement: {
            column: 1,
            row: 0
        },
        factory: () => <ToolPathTile />
    },
    {
        id: GlowbuzzerDockComponent.CARTESIAN_DRO,
        name: "Cartesian DRO",
        defaultPlacement: {
            column: 0,
            row: 2
        },
        factory: () => <CartesianDroTile />
    },
    {
        id: GlowbuzzerDockComponent.SPINDLE,
        name: "Spindle",
        defaultPlacement: {
            column: 2,
            row: 0
        },
        factory: () => <SpindleTile />
    },
    {
        id: GlowbuzzerDockComponent.DIGITAL_INPUTS,
        name: "Digital Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <DigitalInputsTile />
    },
    {
        id: GlowbuzzerDockComponent.INTEGER_INPUTS,
        name: "Integer Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <IntegerInputsTile />
    },
    {
        id: GlowbuzzerDockComponent.ANALOG_INPUTS,
        name: "Analog Inputs",
        defaultPlacement: {
            column: 2,
            row: 1
        },
        factory: () => <AnalogInputsTile />
    }
]

const DEFAULT_MODEL: IJsonModel = {
    global: {
        tabSetEnableMaximize: false
    },
    borders: [],
    layout: {
        type: "row",
        id: "root",
        children: [
            {
                type: "row",
                weight: 25,
                children: [
                    {
                        type: "tabset",
                        id: "connect-solo",
                        enableDrop: false, // don't allow tabs to be added here
                        children: []
                    }
                ]
            },
            {
                type: "row",
                weight: 50,
                children: []
            },
            {
                type: "row",
                weight: 25,
                children: []
            }
        ]
    }
}

type GlowbuzzerDockLayoutProps = {
    components?: (Partial<GlowbuzzerDockComponentDefinition> & { id: string })[]
    exclude?: string[]
    children: ReactNode
}

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
`

function add_component(modelJson, component) {
    const { column, row } = component.defaultPlacement

    const col = modelJson.layout.children[column]

    if (col.type === "tabset") {
        // only one tabset in the column
        col.children.push({
            type: "tab",
            ...component
        })
    } else {
        while (col.children.length <= row) {
            col.children.push({
                type: "tabset",
                children: []
            })
        }
        col.children[row].children.push({
            type: "tab",
            ...component
        })
    }
}

export const GlowbuzzerDockLayoutProvider = ({
    components: configuredComponents,
    exclude,
    children
}: GlowbuzzerDockLayoutProps) => {
    const { model: defaultModel, components } = useMemo(() => {
        // take the components passed in and merge with defaults from the standard components
        const components = Object.fromEntries(
            (configuredComponents ?? Object.values(GLOWBUZZER_COMPONENTS))
                .filter(c => !exclude?.includes(c.id)) // remove excluded components
                .map(c => [
                    c.id,
                    {
                        ...(GLOWBUZZER_COMPONENTS.find(component => component.id === c.id) ?? {}),
                        ...c
                    }
                ])
        )
        const { connect: configuredConnect, ...otherComponents } = components
        // we insist there is a connect tile
        const connect =
            configuredConnect ??
            GLOWBUZZER_COMPONENTS.find(c => c.id === GlowbuzzerDockComponent.CONNECT)

        // take a copy for modification
        const modelJson = JSON.parse(JSON.stringify(DEFAULT_MODEL))
        // add the solo connect tile to the first column
        modelJson.layout.children[0].children[0].children.push({
            type: "tab",
            ...connect
        })

        for (const component of Object.values(otherComponents)) {
            add_component(modelJson, component)
        }
        return { components, model: Model.fromJson(modelJson) }
    }, [configuredComponents])

    const [model, updateModel] = useState(defaultModel)

    const context: GlowbuzzerDockLayoutContextType = {
        components,
        model,
        factory: (node: TabNode) => {
            const component = components[node.getId()]
            return component.factory()
        },
        updateModel: new_model => {
            // model object is not changed, so we need to force a re-render
            updateModel(Model.fromJson(new_model.toJson()))
        },

        showComponent(id: string, show: boolean = false) {
            if (!show) {
                model.doAction(Actions.deleteTab(id))
            } else {
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

    return (
        <StyledDiv>
            <GlowbuzzerDockLayoutContext.Provider value={context}>
                {children}
            </GlowbuzzerDockLayoutContext.Provider>
        </StyledDiv>
    )
}

export function useGlowbuzzerDock() {
    return useContext(GlowbuzzerDockLayoutContext)
}

type GlowbuzzerDockComponentCurrent = Partial<GlowbuzzerDockComponentDefinition> & {
    visible: boolean
}

export function useGlowbuzzerDockComponents(): GlowbuzzerDockComponentCurrent[] {
    const { model, components } = useContext(GlowbuzzerDockLayoutContext)
    return Object.values(components).map(component => ({
        ...component,
        visible: !!model.getNodeById(component.id)
    }))
}
