/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import {
    configMetadata,
    configSlice,
    GlowbuzzerConfig,
    MachineState,
    ToolConfig,
    useConfig,
    useMachineState,
    useSoloActivity,
    useToolIndex,
    useToolList
} from "@glowbuzzer/store"
import { ColumnType } from "antd/es/table"
import { useDispatch } from "react-redux"
import { ToolConfigEditor } from "./ToolConfigEditor"
import { Button, Space } from "antd"
import { TileWithEditableTableSupport } from "../util"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Material, Object3D } from "three"
import { DockToolbarButtonGroup } from "../dock"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as DatabaseIcon } from "@material-symbols/svg-400/outlined/dns.svg"
import { useState } from "react"
import { ToolModelManagementModal } from "./ToolModelManagementModal"
import { ToolPreviewButton } from "./ToolPreviewButton"

interface GLBModelProps {
    url: string
    scale?: number
}

interface GLTFResult extends GLTF {
    nodes: Record<string, Object3D>
    materials: Record<string, Material>
}

function GLBModel({ url, scale = 1000 }: GLBModelProps) {
    const { scene } = useGLTF(url)
    return <primitive object={scene} scale={[scale, scale, scale]} />
}

const GLBViewer = ({ url, scale = 1 }: GLBModelProps) => {
    return (
        <Canvas style={{ height: 200, width: 200 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <OrbitControls />
            {url && <GLBModel url={url} scale={scale} />}
        </Canvas>
    )
}

export type ToolsTileTableEntry = GlowbuzzerConfig["tool"][0] & { name?: string; id: number }

/**
 * @ignore
 */
export const ToolsTile = () => {
    const tools = useToolList()
    const dispatch = useDispatch()
    const api = useSoloActivity(0)
    const currentState = useMachineState()
    const [showFileManagement, setShowFileManagement] = useState(false)
    const activeToolIndex = useToolIndex(0)

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
            title: "Filename",
            key: "filename",
            render: (_, tool) => tool.$metadata?.filename
        },
        // {
        //     title: "Description",
        //     dataIndex: "description",
        //     key: "description"
        // },
        // {
        //     title: "3D View",
        //     key: "3dview",
        //     render: (_, record) => (
        //         <GLBViewer url={"" /*record.url doesn't exist yet record.url*/} scale={20} />
        //     ) // Assuming `url` contains the GLB file URL
        // },
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
            render: (_, tool) => {
                return (
                    <Space>
                        <Button
                            size="small"
                            onClick={() => select(tool.id)}
                            disabled={
                                currentState !== MachineState.OPERATION_ENABLED ||
                                activeToolIndex === tool.id
                            }
                        >
                            Activate
                        </Button>
                        <ToolPreviewButton filename={tool.$metadata?.filename} />
                    </Space>
                )
            }
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
        <>
            {showFileManagement && (
                <ToolModelManagementModal onClose={() => setShowFileManagement(false)} />
            )}
            <TileWithEditableTableSupport
                columns={columns}
                items={tools.map((tool, id) => ({ ...tool, id }))}
                onCreate={create_tool}
                onUpdate={update_tool}
                onDelete={delete_tool}
                EditComponent={ToolConfigEditor}
                factory={make_new_tool}
                onVerify={item => item.name?.length > 0}
                toolbarExtra={
                    <DockToolbarButtonGroup>
                        <GlowbuzzerIcon
                            Icon={DatabaseIcon}
                            title="Manage Model Files"
                            button
                            onClick={() => setShowFileManagement(true)}
                        />
                    </DockToolbarButtonGroup>
                }
            />
        </>
    )
}
