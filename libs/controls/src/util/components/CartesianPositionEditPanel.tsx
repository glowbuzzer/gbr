/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ChangeEvent, useEffect, useState } from "react"
import { Button, Input, Space } from "antd"
import { CartesianPosition, POSITIONREFERENCE, WithNameAndDescription } from "@glowbuzzer/store"
import styled from "styled-components"
import { CartesianPositionEdit } from "."

const StyledDiv = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .actions {
        display: flex;
        justify-content: right;
    }
`

export enum CartesianPositionEditPanelMode {
    NONE,
    CREATE,
    UPDATE
}

const DEFAULT_VALUE: WithNameAndDescription<CartesianPosition> = {
    name: "",
    positionReference: POSITIONREFERENCE.ABSOLUTE,
    translation: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0,
        w: 1
    }
}

type CartesianPositionEditModalProps = {
    mode: CartesianPositionEditPanelMode
    readonly?: boolean
    value?: WithNameAndDescription<CartesianPosition>
    onChange: (position: WithNameAndDescription<CartesianPosition>) => void
    onSave: () => void
    onCancel: () => void
}

export const CartesianPositionEditPanel = ({
    mode,
    readonly,
    value: value_or_null,
    onChange,
    onSave,
    onCancel
}: CartesianPositionEditModalProps) => {
    const value = value_or_null || DEFAULT_VALUE
    const [name, setName] = useState(value.name)

    if (mode === CartesianPositionEditPanelMode.NONE) {
        return null
    }

    useEffect(() => {
        const update = value || DEFAULT_VALUE
        // setPosition(update)
        setName(update.name)
    }, [value, mode])

    function update_name(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.value
        setName(name)
        onChange({ ...value, name })
    }

    function handle_change(value: CartesianPosition) {
        onChange({ name, ...value })
    }

    return (
        <StyledDiv>
            <Input value={name} placeholder="Enter name" onChange={update_name} />
            <CartesianPositionEdit value={value} onChange={handle_change} readonly={readonly} />
            <Space className="actions">
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" onClick={onSave} disabled={!name?.length}>
                    {mode === CartesianPositionEditPanelMode.CREATE ? "Create" : "Save"}
                </Button>
            </Space>
        </StyledDiv>
    )
}
