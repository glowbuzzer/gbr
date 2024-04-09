/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Input, Table } from "antd"
import { PrecisionInput } from "../util/components/PrecisionInput"

type Item = {
    key: string
    name: string
    value?: string
}

type EditableCellProps = {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: keyof Item
    record: Item
    handleSave: (key: string, update: object) => void
}

function listObject(item: object, parentKey: string) {
    return Object.entries(item)
        .filter(([k]) => k !== "name")
        .map(([key, value], index) => {
            if (typeof value === "object") {
                return {
                    key: `${parentKey}.${key}`,
                    name: key,
                    children: listObject(value, `${parentKey}.${key}`)
                }
            }
            return {
                key: `${parentKey}.${key}`,
                name: key,
                value
            }
        })
}

function listItems(items: any[]) {
    return items.map((item: any, index) => {
        return {
            key: index.toString(),
            name: item.name,
            children: listObject(item, index.toString())
        }
    })
}

// const EditableContext = React.createContext<FormInstance<any> | null>(null)

type EditableRowProps = {
    index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    return <tr {...props} />
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const [editedState, setEditedState] = useState(null)
    const inputRef = useRef<any>(null)
    // const form = useContext(EditableContext)!

    useEffect(() => {
        if (editing) {
            inputRef.current.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        setEditedState(record[dataIndex])
        // form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
        try {
            toggleEdit()
            const update = typeof editedState === "string" ? { name: editedState } : editedState
            handleSave(record.key, update)
        } catch (errInfo) {
            console.log("Save failed:", errInfo)
        }
    }

    const update_edited_state = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedState(e.target.value)
    }

    return (
        <td {...restProps}>
            {editable ? (
                editing ? (
                    typeof editedState === "string" ? (
                        <Input
                            ref={inputRef}
                            onBlur={save}
                            value={editedState}
                            onChange={update_edited_state}
                        />
                    ) : (
                        <PrecisionInput
                            ref={inputRef}
                            value={editedState}
                            onChange={setEditedState}
                            precision={3}
                            onBlur={save}
                        />
                    )
                ) : (
                    <div
                        className="editable-cell-value-wrap"
                        style={{ paddingRight: 24 }}
                        onClick={toggleEdit}
                    >
                        {children}
                    </div>
                )
            ) : (
                <>{children}</>
            )}
        </td>
    )
}

export const PropertyEditor = ({ items, onChange }) => {
    const dataSource = listItems(items)
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    }

    function merge_update(object: any, key: string, value: any) {
        const [index, ...rest] = key.split(".")
        if (Array.isArray(object)) {
            const item = merge_update(object[index], rest.join("."), value)
            console.log("replace item in array", index, item, value)
            return object.map((i, idx) => (idx.toString() == index ? item : i))
        } else {
            if (rest.length === 0) {
                console.log("merge leaf item", index, object, value)
                return {
                    ...object,
                    [index]: value
                }
            } else {
                console.log("merge object item", object[index], rest.join("."), value)
                return merge_update(object[index], rest.join("."), value)
            }
        }
    }

    function handleSave(key: string, update: object) {
        console.log("handleSave", key, update, items, merge_update(items, key, update))
        onChange(merge_update(items, key, update))
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            onCell: (record: Item) => {
                // only top level items are editable
                // console.log("record", record.key)
                const editable = record.key?.split(".").length === 1
                return {
                    record,
                    editable,
                    dataIndex: "name",
                    value: record.value,
                    // title: item.name
                    handleSave
                }
            }
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            onCell: (record: Item) => {
                const editable = typeof record.value === "number"
                return {
                    record,
                    editable,
                    dataIndex: "value",
                    // title: item.name
                    handleSave
                }
            }
        }
    ]
    return (
        <Table
            size="small"
            dataSource={dataSource}
            columns={columns as any}
            components={components}
            pagination={false}
        />
    )
}
