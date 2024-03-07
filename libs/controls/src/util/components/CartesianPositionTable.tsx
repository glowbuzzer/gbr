/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { RotationDisplay, RotationSelectToolbarItem } from "./RotationSelectToolbarItem"
import { usePref, usePrefs } from "@glowbuzzer/store"
import { DockTileWithToolbar } from "../../dock/DockTileWithToolbar"
import { PrecisionToolbarButtonGroup } from "./PrecisionToolbarButtonGroup"
import { StyledTable } from "../styles/StyledTable"
import React from "react"
import { Popconfirm, TreeDataNode } from "antd"
import { DownOutlined, RightOutlined } from "@ant-design/icons"
import { ColumnType } from "antd/es/table"
import { DockToolbarButtonGroup } from "../../dock/DockToolbar"
import { GlowbuzzerIcon } from "../GlowbuzzerIcon"
import { ReactComponent as EditIcon } from "@material-symbols/svg-400/outlined/edit.svg"
import { ReactComponent as AddIcon } from "@material-symbols/svg-400/outlined/add.svg"
import { ReactComponent as DeleteIcon } from "@material-symbols/svg-400/outlined/delete.svg"

type CartesianPositionTableProps = {
    selected: number
    setSelected: (index: number) => void
    items: TreeDataNode[]
    onEdit?(): void
    onAdd?(): void
    onDelete?(): void
}

/**
 * Displays a table of cartesian positions (eg. points or frames). Allows the user to choose how the rotation component should be displayed,
 * and the precision of the displayed values.
 */
export const CartesianPositionTable = ({
    items,
    selected,
    setSelected,
    onEdit,
    onAdd,
    onDelete
}: CartesianPositionTableProps) => {
    const { fromSI, getUnits } = usePrefs()
    const { units: linear_units, precision: linear_precision } = getUnits("linear")
    const { units: angular_units, precision: angular_precision } = getUnits("angular")

    // const [precision, setPrecision] = usePref<number>("positionPrecision", 2)
    const [rotationDisplay, setRotationDisplay] = usePref("rotationDisplay", RotationDisplay.EULER)

    const columns: ColumnType<any>[] = [
        {
            title: "Name",
            className: "name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
            width: "30%"
        },
        ...["x", "y", "z"].map(key => ({
            key: key,
            title: key.toUpperCase(),
            ellipsis: true,
            dataIndex: key,
            render: (value: number) => fromSI(value, "linear").toFixed(linear_precision),
            align: "right" as "right"
        }))
    ]

    switch (rotationDisplay) {
        case RotationDisplay.QUATERNION:
            columns.push(
                ...["x", "y", "z", "w"].map(key => ({
                    key: "q" + key,
                    title: "q" + key.toUpperCase(),
                    ellipsis: true,
                    dataIndex: "q" + key,
                    render: (value: number) => value.toFixed(2),
                    align: "right" as "right"
                }))
            )
            break
        case RotationDisplay.EULER:
            columns.push(
                ...["a", "b", "c"].map(key => ({
                    key: key,
                    title: key.toUpperCase(),
                    ellipsis: true,
                    dataIndex: key,
                    render: (value: number) => fromSI(value, "angular").toFixed(angular_precision),
                    align: "right" as "right"
                }))
            )
            break
    }

    const rowSelection = {
        selectedRowKeys: [selected],
        onChange: r => setSelected(r[0])
    }

    const expand_icon = ({ expanded, onExpand, record }) => {
        if ((record as any).children) {
            return expanded ? (
                <DownOutlined className="toggle-icon" onClick={e => onExpand(record, e)} />
            ) : (
                <RightOutlined className="toggle-icon" onClick={e => onExpand(record, e)} />
            )
        } else {
            // placeholder to keep the alignment
            return <RightOutlined className="toggle-icon hidden" />
        }
    }

    function selectRow(record) {
        try {
            setSelected(Number(record.key))
        } catch (e) {
            console.error(e)
        }
    }

    const nested = items.some(node => node.children?.length > 0)
    const no_selection = (selected ?? true) === true

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    {(onEdit || onAdd || onDelete) && (
                        <DockToolbarButtonGroup>
                            {onEdit && (
                                <GlowbuzzerIcon
                                    Icon={EditIcon}
                                    useFill={true}
                                    title="Edit"
                                    button
                                    disabled={no_selection}
                                    onClick={onEdit}
                                />
                            )}
                            {onAdd && (
                                <GlowbuzzerIcon
                                    useFill={true}
                                    Icon={AddIcon}
                                    title="New"
                                    button
                                    onClick={onAdd}
                                />
                            )}
                            {onDelete && (
                                <Popconfirm
                                    title={<>Are you sure to delete this item?</>}
                                    onConfirm={onDelete}
                                    onCancel={() => {}}
                                    okText="Delete"
                                    cancelText="Cancel"
                                >
                                    <GlowbuzzerIcon
                                        useFill={true}
                                        Icon={DeleteIcon}
                                        button
                                        disabled={no_selection}
                                    />
                                </Popconfirm>
                            )}
                        </DockToolbarButtonGroup>
                    )}
                    <RotationSelectToolbarItem
                        value={(rotationDisplay || RotationDisplay.NONE) as RotationDisplay}
                        onChange={setRotationDisplay}
                    />
                </>
            }
        >
            <StyledTable
                dataSource={items}
                columns={columns}
                size={"small"}
                pagination={false}
                expandable={nested ? { expandIcon: expand_icon } : undefined}
                rowSelection={{ type: "radio", ...rowSelection }}
                onRow={record => ({
                    onClick: () => selectRow(record)
                })}
            />
        </DockTileWithToolbar>
    )
}
