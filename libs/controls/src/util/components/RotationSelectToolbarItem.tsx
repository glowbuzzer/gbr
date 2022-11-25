/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Select } from "antd"
import * as React from "react"
import styled from "styled-components"

import { ReactComponent as RotationIcon } from "../../icons/rotation.svg"
import { dockDropdownStyle } from "../../dock/styles"

const StyledSelect = styled(Select)`
    ${dockDropdownStyle}
    svg {
        transform: translateY(1 ópx);

        path {
            stroke: rgba(0, 0, 0, 0.6);
            stroke-width: 5px;
        }
    }
`

export enum RotationDisplay {
    NONE,
    QUATERNION,
    EULER
}

type RotationSelectToolbarItemProps = {
    value: RotationDisplay
    onChange: (value: RotationDisplay) => void
}

const OPTIONS = [
    {
        key: RotationDisplay.NONE,
        value: RotationDisplay.NONE,
        label: "None",
        display: (
            <>
                <RotationIcon height={16} /> None
            </>
        )
    },
    {
        key: RotationDisplay.QUATERNION,
        value: RotationDisplay.QUATERNION,
        label: "Quaternion",
        display: (
            <>
                <RotationIcon height={16} /> Quaternion
            </>
        )
    },
    {
        key: RotationDisplay.EULER,
        value: RotationDisplay.EULER,
        label: "Euler",
        display: (
            <>
                <RotationIcon height={18} /> Euler
            </>
        )
    }
]

/** @ignore */
export const RotationSelectToolbarItem = ({ value, onChange }: RotationSelectToolbarItemProps) => {
    return (
        <StyledSelect
            options={OPTIONS}
            value={value}
            onChange={onChange}
            optionLabelProp="display"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 200 }}
        />
    )
}
