import { Frame } from "@glowbuzzer/store"
import * as React from "react"
import { Select } from "antd"

const Option = Select.Option as any
type FrameSelectorDropdownProps = {
    items: Frame[]
}
export type FrameSelectorProps = {
    defaultFrame?: number
    onChange(frameIndex: number): void
}

function render_items(items: Frame[], result: any[], level: number, defaultFrame?: number) {
    for (const i of items) {
        const indent = 12 + level * 10 + "px"
        const isDefault = defaultFrame === i.index

        result.push(
            <Option key={i.index} value={i.index} style={{ paddingLeft: indent }}>
                {i.text} {isDefault ? " *" : ""}
            </Option>
        )

        if (i.children) {
            render_items(i.children, result, level + 1, defaultFrame)
        }
    }
}

export const FrameSelectorDropdown = (props: FrameSelectorDropdownProps & FrameSelectorProps) => {
    const items = [
        <Option key={"world"} value={"world"} style={{ fontStyle: "italic" }}>
            World
        </Option>
    ] as any[]

    render_items(props.items, items, 0, props.defaultFrame)

    return (
        <Select dropdownMatchSelectWidth={200} defaultValue={props.defaultFrame} onChange={props.onChange}>
            {items}
        </Select>
    )
}
