/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    configSlice,
    GlowbuzzerConfig,
    MachineState,
    ToolConfig,
    useMachineState,
    useSoloActivity,
    useToolList
} from "@glowbuzzer/store"
import { ColumnType } from "antd/es/table"
import { useDispatch } from "react-redux"
import { ToolConfigEditor } from "./ToolConfigEditor"
import { Button } from "antd"
import { TileWithEditableTableSupport } from "../util"

export type ToolsTileTableEntry = ToolConfig & { name: string; id: number }

export const ToolsTile = () => {
    const tools = useToolList()
    const dispatch = useDispatch()
    const api = useSoloActivity(0)
    const currentState = useMachineState()

    const definitions = tools.map((tool, index) => ({
        id: index,
        ...tool
    }))

    function select(index: number) {
        return api.setToolOffset(index).promise()
    }

    const columns: ColumnType<ToolsTileTableEntry>[] = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Length",
            key: "length",
            render: (_, record) => record.translation?.z || 0
        },
        {
            title: "Diameter",
            dataIndex: "diameter",
            key: "diameter"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button
                    size="small"
                    onClick={() => select(record.id)}
                    disabled={currentState !== MachineState.OPERATION_ENABLED}
                >
                    Activate
                </Button>
            )
        }
    ]

    function store(tool: GlowbuzzerConfig["tool"]) {
        dispatch(configSlice.actions.addConfig({ tool }))
    }

    function create_tool(tool: ToolsTileTableEntry) {
        const { id, ...created } = tool
        const update = [...tools, created]
        store(update)
    }

    function update_tool(tool: ToolsTileTableEntry) {
        const { id, ...modified } = tool
        const update = tools.map((t, index) => (index === id ? modified : t))
        store(update)
    }

    function delete_tool(n: number) {
        const update = tools.filter((_, index) => index !== n)
        store(update)
    }

    function make_new_tool(): ToolConfig {
        return {
            translation: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            diameter: 0,
            rigidBodyInertia: {
                Ixx: 0,
                Iyy: 0,
                Izz: 0,
                Ixy: 0,
                Ixz: 0,
                Iyz: 0,
                m: 0,
                h: { x: 0, y: 0, z: 0 }
            }
        }
    }

    return (
        <TileWithEditableTableSupport
            columns={columns}
            items={definitions}
            onCreate={create_tool}
            onUpdate={update_tool}
            onDelete={delete_tool}
            EditComponent={ToolConfigEditor}
            factory={make_new_tool}
            onVerify={item => item.name?.length > 0}
        />
    )
}
