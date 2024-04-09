/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { Loader } from "@react-three/drei"
import { Flex, Input, Tree, TreeDataNode } from "antd"
import { GbdbItem } from "../GbdbProvider"

type DocumentSelectListProps = {
    files: GbdbItem[]
    onSelect(doc: GbdbItem): void
    onChangeFilter(filter: string): void
    onDoubleClick(doc: GbdbItem): void
    filter: boolean
}

export const DocumentSelectList = ({
    files,
    onSelect,
    onChangeFilter,
    onDoubleClick,
    filter: filterEnabled
}: DocumentSelectListProps) => {
    const [selected, setSelected] = useState<string>(null)
    const [filter, setFilter] = useState<string>("")

    function select_item(selectedKeys: string[]) {
        if (selectedKeys.length === 0) {
            console.log("No item selected")
            setSelected(null)
            onSelect(null)
            return
        }
        const id = selectedKeys[0]
        setSelected(id)
        if (!filterEnabled) {
            setFilter(id)
            onChangeFilter(id)
        }
        const doc = files.find(f => f._id === id)
        onSelect(doc)
    }

    function double_click_item(_e, node: TreeDataNode) {
        const doc = files.find(f => f._id === node.key)
        onDoubleClick(doc)
    }

    function update_filter(e: React.ChangeEvent<HTMLInputElement>) {
        setSelected(null)
        onSelect(null)
        setFilter(e.target.value)
        onChangeFilter(e.target.value)
    }

    const treeData = files
        ?.map(f => ({
            title: f._id,
            key: f._id
        }))
        .filter(f => {
            if (!filterEnabled || filter === "") {
                return true
            }
            return f.title.includes(filter)
        })

    return (
        <Flex vertical gap="small">
            <Input
                type="text"
                placeholder={filterEnabled ? "Enter filter" : "Enter name"}
                value={filter}
                onChange={update_filter}
            />
            {files === undefined ? (
                <Loader />
            ) : treeData.length ? (
                <Flex vertical gap="small">
                    <Tree
                        treeData={treeData}
                        onSelect={select_item}
                        onDoubleClick={double_click_item}
                        selectedKeys={[selected]}
                        activeKey={selected}
                    />
                </Flex>
            ) : filterEnabled && !!filter.length ? (
                <div>No matching items found</div>
            ) : (
                <div>No items found</div>
            )}
        </Flex>
    )
}
