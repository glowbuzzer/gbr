/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Select } from "antd"
import { useKinematicsConfigurationList } from "@glowbuzzer/store"
import * as React from "react"
import styled from "styled-components"

import { ReactComponent as KcIcon } from "@material-symbols/svg-400/outlined/precision_manufacturing.svg"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { dockDropdownStyle } from "../dock/styles"

const StyledSelect = styled(Select)`
    ${dockDropdownStyle}
`

type KinematicsDropdownProps = {
    value: number
    placeholder?: string
    onChange: (kinematicsConfigurationIndex: number) => void
}

/** @ignore */
export const KinematicsDropdown = ({ value, placeholder, onChange }: KinematicsDropdownProps) => {
    const kcs = useKinematicsConfigurationList()

    if (kcs.length < 2) {
        return null
    }

    const options = kcs.map((kc, index) => ({
        key: index,
        value: index,
        display: (
            <>
                <GlowbuzzerIcon Icon={KcIcon} name={"kc"} />
                <span className="selected-text">{kc.name}</span>
            </>
        ),
        label: kc.name
    }))

    return (
        <StyledSelect
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            optionLabelProp="display"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 200 }}
        />
    )
}
