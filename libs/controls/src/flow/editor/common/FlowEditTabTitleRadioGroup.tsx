/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { StyledEditTabCardTitle } from "../styles"
import { Radio } from "antd"

type FlowEditTabTitleRadioGroupProps = {
    title: string
    value: string | number | boolean
    onChange(value: string | number | boolean): void
    options: { value: string | number | boolean; label: string }[]
}

export const FlowEditTabTitleRadioGroup = ({
    title,
    options,
    value,
    onChange
}: FlowEditTabTitleRadioGroupProps) => {
    return (
        <StyledEditTabCardTitle>
            <div>{title}</div>
            <Radio.Group
                size="small"
                value={value}
                onChange={e => onChange(e.target.value)}
                buttonStyle="solid"
            >
                {options.map(option => (
                    <Radio.Button key={option.value?.toString()} value={option.value}>
                        {option.label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </StyledEditTabCardTitle>
    )
}
