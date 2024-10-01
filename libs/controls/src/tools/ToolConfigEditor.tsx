/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { CartesianPosition, ToolConfig } from "@glowbuzzer/store"
import { Form, Input, Space } from "antd"
import { ToolsTileTableEntry } from "./ToolsTile"
import { TranslationEdit } from "./TranslationEdit"
import { CartesianPositionEdit, PrecisionInput } from "../util"

export const ToolConfigEditor = ({
    item,
    onChange
}: {
    item: ToolsTileTableEntry
    onChange: (item: ToolsTileTableEntry) => void
}) => {
    function update(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({ ...item, [e.target.name]: e.target.value })
    }

    function update_filename(e: React.ChangeEvent<HTMLInputElement>) {
        const filename = e.target.value.trim().length ? e.target.value.trim() : undefined

        onChange({
            ...item,
            $metadata: {
                ...item.$metadata,
                filename
            }
        })
    }

    function update_value(name: keyof ToolConfig, value: number) {
        onChange({ ...item, [name]: value })
    }

    function update_translation_rotation(update: CartesianPosition) {
        onChange({
            ...item,
            translation: update.translation,
            rotation: update.rotation
        })
    }

    function safe(item: ToolsTileTableEntry): ToolConfig {
        return {
            ...item,
            translation: {
                x: 0,
                y: 0,
                z: 0,
                ...item.translation
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
                w: 1,
                ...item.rotation
            }
        }
    }

    function update_dynamic_prop<T extends keyof ToolConfig["rigidBodyInertia"]>(
        prop: T,
        value: ToolConfig["rigidBodyInertia"][T]
    ) {
        onChange({
            ...item,
            rigidBodyInertia: {
                ...item.rigidBodyInertia,
                [prop]: value
            }
        })
    }

    return (
        <Form labelCol={{ span: 4 }} size="small">
            <Form.Item label="Name">
                <Input value={item.name} name="name" onChange={update} />
            </Form.Item>
            <Form.Item label="Model Filename">
                <Input value={item.$metadata?.filename || ""} onChange={update_filename} />
            </Form.Item>
            <Form.Item label="Diameter">
                <PrecisionInput
                    value={item.diameter || 0}
                    precision={0}
                    onChange={v => update_value("diameter", v)}
                />
            </Form.Item>
            <Form.Item label="Offset">
                <CartesianPositionEdit
                    value={safe(item)}
                    onChange={update_translation_rotation}
                    ignoreFrame
                />
            </Form.Item>
            <Form.Item label="Mass">
                <PrecisionInput
                    value={item.rigidBodyInertia?.m || 0}
                    precision={2}
                    onChange={v => update_dynamic_prop("m", v)}
                />{" "}
                g
            </Form.Item>
            <Form.Item label="CoM">
                <TranslationEdit
                    item={item.rigidBodyInertia.h}
                    onChange={v => update_dynamic_prop("h", v)}
                />
            </Form.Item>
            <Form.Item label="MoI">
                {[
                    ["Ixx", "Iyy", "Izz"],
                    ["Ixy", "Ixz", "Iyz"]
                ].map((row, i) => (
                    <Space key={i}>
                        {row.map((prop, j) => (
                            <React.Fragment key={prop}>
                                {prop}
                                <PrecisionInput
                                    key={j}
                                    value={item.rigidBodyInertia[prop] || 0}
                                    precision={2}
                                    onChange={v => update_dynamic_prop(prop as any, v)}
                                />
                            </React.Fragment>
                        ))}
                    </Space>
                ))}
            </Form.Item>
        </Form>
    )
}
