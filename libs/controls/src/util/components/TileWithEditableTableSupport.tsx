/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ComponentType, useState } from "react"
import styled from "styled-components"
import { ColumnType } from "antd/es/table"
import { Button, Popconfirm, Space, Table } from "antd"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as AddIcon } from "@material-symbols/svg-400/outlined/add.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"
import { DockToolbar, DockToolbarButtonGroup } from "../../dock"
import { GlowbuzzerIcon } from "../GlowbuzzerIcon"

const StyledDiv = styled.div`
    padding: 10px;

    .actions {
        margin-top: 10px;
        text-align: right;
    }
`

type EditComponent<T> = {
    item: T
    onChange: (item: T) => void
}

type TileEditableTableSupportProps<T extends { id: string | number }> = {
    columns: ColumnType<T>[]
    items: T[]
    onCreate: (item: T) => void
    onUpdate: (item: T) => void
    onDelete: (id: T["id"]) => void
    onSelect?: (id: T["id"]) => void
    EditComponent: ComponentType<EditComponent<T>>
    onVerify?: (item: T) => boolean
    factory: () => Omit<T, "id">
    toolbarExtra?: React.ReactNode
}

enum EditMode {
    None,
    Create,
    Update
}

/**
 * A tile with support for a table with create/update mode. It supports creating, updating and deleting items. It is intended to be used as a complete tile.
 *
 * You need to provide the columns, items, and callbacks for creating, updating and deleting items. You also need to provide an EditComponent that is rendered when
 * an item is being created or updated. The EditComponent receives the item being edited and an `onChange` callback, which should be called on every change.
 *
 * The items must have an id property that is unique for each item. The id is used to select items in the table.
 *
 * You can provide an onValidate callback that is used to determine if the item is valid. If the item is not valid, the create/update button will be disabled.
 *
 * The factory callback is used to create a new item when entering create mode. This component will generate a unique id, so your function
 * should return an object without an id property.
 *
 * @param columns The columns for the table, as expected by Ant Design Table
 * @param items The items to display in the table
 * @param onCreate Called when the user confirms creation of a new item
 * @param onUpdate Called when the user confirms updating an existing item
 * @param onDelete Called when the user confirms deletion of an item
 * @param onSelect Called when the user selects an item in the table
 * @param EditComponent The component to render when creating or updating an item
 * @param onVerify Called to verify if the item is valid. If not provided, the create/update button will always be enabled.
 * @param factory Called to create a new item when entering create mode. The id property will be automatically generated.
 * @param toolbarExtra Extra content to display in the toolbar
 */
export function TileWithEditableTableSupport<T extends { id: string | number }>({
    columns,
    items,
    onCreate,
    onUpdate,
    onDelete,
    onSelect,
    EditComponent,
    onVerify,
    factory,
    toolbarExtra
}: TileEditableTableSupportProps<T>) {
    const [selected, setSelected] = useState<string | null>(null)
    const [mode, setMode] = useState<EditMode>(EditMode.None)
    const [edited, setEdited] = useState<T | null>(null)
    const [unedited, setUnedited] = useState<T | null>(null)
    const [applyAvailable, setApplyAvailable] = useState(false)
    const [saveAvailable, setSaveAvailable] = useState(false)

    const has_selection = selected !== null

    function generate_unique_id() {
        // generate a fixed length alpha-numberic id
        // use the browser's crypto functions
        const array = new Uint8Array(16)
        window.crypto.getRandomValues(array)
        return Array.from(array)
            .map(b => b.toString(36))
            .join("")
    }

    function enter_create_mode() {
        setMode(EditMode.Create)
        const id = generate_unique_id()
        const item = {
            id,
            ...factory()
        } as T
        setEdited(item)
        setSaveAvailable(true)
    }

    function enter_update_mode() {
        setMode(EditMode.Update)
        const item = items.find(i => i.id === selected) || null
        setEdited(item)
        // take a copy for apply/cancel support
        setUnedited({ ...item })
        setSaveAvailable(false)
        setApplyAvailable(false)
    }

    function handle_change(item: T) {
        setEdited(item)
        if (mode === EditMode.Update) {
            // TODO: L: PrecisionInput from GBR triggers update on mount which causes the apply button to be enabled when it should not be,
            //          so we need to test for deep equality here
            const modified = JSON.stringify(item) !== JSON.stringify(unedited)
            setApplyAvailable(modified)
        }
        // TODO: L: PrecisionInput from GBR triggers update on mount which causes the save button to be enabled when it should not be
        setSaveAvailable(true)
    }

    function do_delete() {
        onDelete(selected)
        setSelected(null)
    }

    function cancel() {
        if (mode === EditMode.Update) {
            // roll back any applied changes
            setApplyAvailable(false)
            onUpdate(unedited)
        }
        setMode(EditMode.None)
        setEdited(null)
    }

    function do_action() {
        if (mode === EditMode.Create) {
            onCreate(edited)
        } else {
            onUpdate(edited)
        }
        setMode(EditMode.None)
    }

    function apply() {
        onUpdate(edited)
        // setUnedited({ ...edited })
        setApplyAvailable(false)
    }

    // we need to add a key property to support selection

    const dataSource = items.map(item => ({ key: item.id, ...item }))

    if (mode === EditMode.Create || mode === EditMode.Update) {
        const invalid = onVerify && !onVerify(edited)
        return (
            <StyledDiv>
                <EditComponent item={edited} onChange={handle_change} />
                <div className="actions">
                    <Space>
                        <Button onClick={cancel}>Cancel</Button>
                        {mode === EditMode.Update && (
                            <Button onClick={apply} disabled={!applyAvailable}>
                                Apply
                            </Button>
                        )}
                        <Button
                            type="primary"
                            onClick={do_action}
                            disabled={invalid || !saveAvailable}
                        >
                            {mode === EditMode.Create ? "Create" : "OK"}
                        </Button>
                    </Space>
                </div>
            </StyledDiv>
        )
    }

    return (
        <div>
            <DockToolbar>
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        Icon={EditIcon}
                        useFill={true}
                        title="Edit"
                        button
                        disabled={!has_selection}
                        onClick={enter_update_mode}
                    />
                    <GlowbuzzerIcon
                        useFill={true}
                        Icon={AddIcon}
                        title="New"
                        button
                        onClick={enter_create_mode}
                    />
                    <Popconfirm
                        title={<>Are you sure to delete this item?</>}
                        onConfirm={do_delete}
                        onCancel={() => {}}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <GlowbuzzerIcon
                            useFill={true}
                            Icon={DeleteIcon}
                            button
                            disabled={!has_selection}
                        />
                    </Popconfirm>
                </DockToolbarButtonGroup>
                {toolbarExtra}
            </DockToolbar>
            <Table
                size="small"
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                rowSelection={{
                    type: "radio",
                    ...{
                        selectedRowKeys: [selected],
                        onChange: (r: string[]) => {
                            onSelect?.(r[0])
                            setSelected(r[0])
                        }
                    }
                }}
            />
        </div>
    )
}
