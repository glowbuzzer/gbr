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
    useToolList
} from "@glowbuzzer/store"
import { ColumnType } from "antd/es/table"
import { useDispatch } from "react-redux"
import { ToolConfigEditor } from "./ToolConfigEditor"
import { Button } from "antd"
import { TileWithEditableTableSupport } from "../util"
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Material, Object3D } from "three"
import { DockToolbarButtonGroup } from "../dock"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { ReactComponent as DatabaseIcon } from "@material-symbols/svg-400/outlined/dns.svg"
import { useState } from "react"
import { FileManagementModal } from "./FileManagementModal"

interface GLBModelProps {
    url: string
    scale?: number
}

interface GLTFResult extends GLTF {
    nodes: Record<string, Object3D>
    materials: Record<string, Material>
}

function GLBModel({ url, scale = 1000 }: GLBModelProps) {
    const { scene } = useGLTF(url) as GLTFResult
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

export const mockToolUrls = [
    {
        id: 0,
        url: "https://static.glowbuzzer.com/assets/tools/Schmalz_FQE_Xc_120x60.glb"
    },
    {
        id: 1,
        url: "https://static.glowbuzzer.com/assets/tools/Schmalz_FQE_Xc_220x80.glb"
    }
    // Add more tools as needed
]

export type ToolsTileTableEntry = ToolConfig & { name?: string; id: number }

export const ToolsTile = () => {
    const tools = useToolList()
    const dispatch = useDispatch()
    const api = useSoloActivity(0)
    const currentState = useMachineState()
    const config = useConfig()
    const [showFileManagement, setShowFileManagement] = useState(false)

    // const getMetadataProperty = {}

    // Get metadata from the config
    const metadata = configMetadata(config.tool[0], true)

    // // Check if metadata exists
    // if (!metadata) {
    //     return undefined
    // }
    //
    // // Return the requested property from metadata
    // return metadata[propertyName]
    // }

    // Usage example:

    // const definitions = tools.map((tool, index) => ({
    //     id: index,
    //     ...tool
    // }))

    // Merge real tool data with mock URLs
    const toolsWithUrls = tools.map((tool, index) => ({
        ...tool,
        url: mockToolUrls.find(mockTool => mockTool.id === index)?.url
    }))

    const definitions = toolsWithUrls.map((tool, index) => ({
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
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
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
        <>
            <FileManagementModal
                open={showFileManagement}
                onClose={() => setShowFileManagement(false)}
            />
            <TileWithEditableTableSupport
                columns={columns}
                items={definitions}
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
