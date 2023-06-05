/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React from "react"
import { ElkEdgeSection, ElkNode } from "elkjs"
import styled from "styled-components"

const StyledSvg = styled.svg`
    .node {
        rect {
            fill: none;
            rx: 5px;
            ry: 5px;
            stroke: ${props => props.theme.colorText};
        }
        text {
            fill: ${props => props.theme.colorText};
            text-anchor: middle;
            dominant-baseline: middle;
            transform: translate(0, 1px);
        }
        &.current {
            rect {
                fill: ${props => props.theme.colorBorder};
            }
            text {
                fill: ${props => props.theme.colorText};
                font-weight: bold;
            }
        }
    }
    .edge path {
        fill: none;
        stroke: ${props => props.theme.colorText};
        marker-end: url(#arrow);
    }
    .arrow path {
        fill: ${props => props.theme.colorText};
    }
`

export type ElkNodeWithLabel = Omit<ElkNode, "children"> & {
    label?: string
    children?: ElkNodeWithLabel[]
}

type RenderElkjsProps = {
    layout: ElkNodeWithLabel
    nodeWidth: number
    nodeHeight: number
    currentState: string
}

export const RenderElkjs = ({ layout, currentState, nodeWidth, nodeHeight }: RenderElkjsProps) => {
    if (!layout) {
        return null
    }

    function edges(sections: ElkEdgeSection[]) {
        if (sections.length > 1) {
            throw new Error("Multiple edge sections not supported!")
        }
        // convert edge with bends to a single svg path
        const section = sections[0]
        const start = `M${section.startPoint.x},${section.startPoint.y}`
        const bendPoints = section.bendPoints?.map(point => `L${point.x},${point.y}`)
        const end = `L${section.endPoint.x},${section.endPoint.y}`
        return [start, bendPoints, end].filter(Boolean).flat().join(" ")
    }

    // Render the layout
    return (
        <StyledSvg width="100%" height="100%">
            <defs>
                <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="10"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                    className="arrow"
                >
                    <path d="M0 0 L10 5 L0 10 L2 5 L0 0 z" />
                </marker>
            </defs>

            {layout.children.map((child, index) => {
                const classes = ["node", child.id === currentState && "current"]
                    .filter(Boolean)
                    .join(" ")
                return (
                    <g
                        key={index}
                        transform={`translate(${child.x}, ${child.y})`}
                        className={classes}
                    >
                        <rect width={child.width} height={child.height} />
                        <text x={nodeWidth / 2} y={nodeHeight / 2} fill="black">
                            {child.label || child.id}
                        </text>
                    </g>
                )
            })}
            {layout.edges.map((edge, index) => {
                return (
                    <g key={index} className="edge">
                        <path d={edges(edge.sections)} />
                    </g>
                )
            })}
        </StyledSvg>
    )
}
