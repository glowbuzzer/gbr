/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Select } from "antd"
import * as React from "react"
import styled from "styled-components"

import { ReactComponent as RotationIcon } from "../../icons/rotation.svg"

const StyledSelect = styled(Select)`
    height: 20px;

    .ant-select-selector {
        padding-left: 2px !important;
    }

    &.ant-select-open svg path {
        opacity: 0.2;
    }

    .ant-select-selection-item span {
        display: inline-block;
        padding-left: 4px;
    }

    svg {
        transform: translate(0, 3px);

        path {
            stroke: ${props => props.theme.colorText};
            opacity: 0.8;
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
                <RotationIcon height={16} />
                <span>None</span>
            </>
        )
    },
    {
        key: RotationDisplay.QUATERNION,
        value: RotationDisplay.QUATERNION,
        label: "Quaternion",
        display: (
            <>
                <RotationIcon height={16} />
                <span>Quaternion</span>
            </>
        )
    },
    {
        key: RotationDisplay.EULER,
        value: RotationDisplay.EULER,
        label: "Euler",
        display: (
            <>
                <RotationIcon height={18} />
                <span>Euler</span>
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
            popupMatchSelectWidth={false}
            bordered={false}
            dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 200 }}
        />
    )
}
