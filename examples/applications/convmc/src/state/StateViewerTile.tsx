/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import ELK, { ElkExtendedEdge } from "elkjs/lib/elk.bundled.js"
import { ElkNodeWithLabel, RenderElkjs } from "./RenderElkjs"
import { useEffect, useState } from "react"
import { ElkNode } from "elkjs"
import { useAppState } from "../store"
import { useArrayMemo } from "../util"

const NODE_HEIGHT = 28
const NODE_PADDING = 8

/**
 * Tile that displays a state machine using elkjs as the layout engine. Displays the states and connections between them,
 * and highlights the current state.
 */
export const StateViewerTile = () => {
    const { definition, currentState } = useAppState().currentWorkflowState
    const [layout, setLayout] = useState<ElkNodeWithLabel>(null)

    const { node_width, children, edges } = useArrayMemo(() => {
        // Measure the width of the longest label
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        context.font = "16px Arial" // Set to the font style you are using
        const node_width =
            Object.keys(definition).reduce((max, key) => {
                const metrics = context.measureText(definition[key].label || key)
                return Math.max(max, metrics.width)
            }, 0) + NODE_PADDING

        // Create a node for each state
        const children: ElkNode[] = Object.keys(definition).map(key => {
            return {
                id: key,
                width: node_width,
                height: NODE_HEIGHT
            }
        })

        // Create an edge for each transition
        const edges: ElkExtendedEdge[] = Object.entries(definition).flatMap(([source, value]) => {
            const explicit = Object.keys(value.transitions)
            const implicit = value.implicitTransitions || []
            return [...explicit, ...implicit].map(target => {
                return {
                    id: `${source}-${target}`,
                    sources: [source],
                    targets: [target]
                }
            })
        })

        return { node_width, children, edges }
    }, definition)

    useEffect(() => {
        // Run the layout algorithm
        const elk = new ELK()
        const graph = {
            id: "root",
            layoutOptions: {
                algorithm: "layered",
                "elk.direction": "DOWN",
                "elk.spacing.nodeNode": "50",
                "elk.layered.spacing.nodeNodeBetweenLayers": "40"
            },
            children,
            edges
        }
        elk.layout(graph)
            .then(r => {
                r.children.forEach((child: ElkNodeWithLabel) => {
                    // Add the custom label to the node, if it exists
                    child.label = definition[child.id].label
                })

                setLayout(r)
            })
            .catch(console.error)
    }, [children, edges])

    return (
        <RenderElkjs
            layout={layout}
            nodeWidth={node_width}
            nodeHeight={NODE_HEIGHT}
            currentState={currentState}
        />
    )
}
