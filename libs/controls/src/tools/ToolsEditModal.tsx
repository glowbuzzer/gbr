/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Modal } from "antd"
import { useEffect, useState } from "react"
import { useToolList } from "@glowbuzzer/store"
import { PropertyEditor } from "../misc/PropertyEditor"

export const ToolsEditModal = ({ onClose }) => {
    const tools = useToolList()
    const [editable, setEditable] = useState(tools || [])

    useEffect(() => {
        setEditable(tools || [])
    }, [tools])

    function add() {
        setEditable([
            ...editable,
            {
                name: "New Tool",
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
        ])
    }

    return (
        <Modal open onOk={onClose} onCancel={onClose} title="Edit Tools">
            <Button size="small" onClick={add}>
                Add Tool
            </Button>
            <PropertyEditor items={editable} onChange={setEditable} />
        </Modal>
    )
}
