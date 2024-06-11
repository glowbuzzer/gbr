import React from "react"
import { SimpleObject } from "../slavecatTypes/SimpleObject"
import { DataNode, transformToTreeData } from "./transformToTreeData"
import { Tree, Tooltip, TreeProps } from "antd"
import { useState, useEffect } from "react"
import styled from "styled-components"
import { useGlowbuzzerTheme } from "@glowbuzzer/controls"

const StyledTree = styled(Tree)<{ darkMode: boolean }>`
    .ant-tree-treenode-disabled .ant-tree-node-content-wrapper {
        color: ${({ darkMode }) =>
            darkMode
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.75)"}; /* Adjust based on dark mode */
    }

    .ant-tree-treenode-disabled .ant-tree-node-content-wrapper:hover {
        color: ${({ darkMode }) =>
            darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.45)"}; /* Adjust hover color */
    }

    .ant-tree-node-content-wrapper {
        color: ${({ darkMode }) =>
            darkMode
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(0, 0, 0, 0.85)"}; /* Adjust default node color */
    }
`

const renderTreeTitle = (node: any) => {
    return (
        <Tooltip
            title={`Flags: ${node.flags || "N/A"}, Type: ${node.dataType || "N/A"}, Unit: ${
                node.unit || "N/A"
            }`}
            placement="right" // Adjust placement as needed
            mouseEnterDelay={0.5} // Add a slight delay
        >
            <span>{node.title}</span>
        </Tooltip>
    )
}

interface SimpleObjectTreeProps {
    data: SimpleObject[]
    onSelect: (node: DataNode) => void
}

export const SimpleObjectTree: React.FC<SimpleObjectTreeProps> = ({ data, onSelect }) => {
    if (!data) {
        return null
    }
    const { darkMode } = useGlowbuzzerTheme()

    const treeData = transformToTreeData(data)

    const handleSelect: TreeProps["onSelect"] = (_, info) => {
        const selectedNode = info.node as any

        if (selectedNode && !selectedNode.disable) {
            onSelect(selectedNode)
        }
    }

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys)
        setAutoExpandParent(false) // Avoid auto-expanding parents after manual expansion
    }

    return (
        <StyledTree
            treeData={treeData}
            titleRender={renderTreeTitle}
            selectable
            onSelect={handleSelect}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            darkMode={darkMode} // Pass darkMode prop
        />
    )
}
