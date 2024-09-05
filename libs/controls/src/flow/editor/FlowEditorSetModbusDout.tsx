/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useFlowEdit } from "./FlowEditModal"
import { Select, Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import * as React from "react"
import { StyledEditTabCardContent } from "./styles"
import { PrecisionInput } from "../../util"
import { useModbusDigitalOutputList } from "@glowbuzzer/store"

const ModbusDoutMultiple = ({ index, values, onChange }) => {
    const outputs = useModbusDigitalOutputList()
    const config = outputs[index]
    if (!config) {
        return "Invalid output, please select another"
    }

    const count = config.endAddress - config.startAddress + 1
    const array = Array.from({ length: count }, (_, i) => !!values[i])

    return array.map((v, i) => (
        <Select
            key={i}
            size="small"
            options={[
                { key: 0, label: "ON", value: true },
                { key: 1, label: "OFF", value: false }
            ]}
            popupMatchSelectWidth={false}
            value={v}
            onChange={v => onChange(array.map((v1, j) => (i === j ? v : v1)))}
        />
    ))
}

export const FlowEditorSetModbusDout = () => {
    const { item, onChange } = useFlowEdit()
    const outputs = useModbusDigitalOutputList()
    const params = item.setModbusDout
    const index = params.doutToSet

    const tabs: TabsProps["items"] = [
        {
            ...FlowEditorTabs.settings,
            children: (
                <StyledEditTabCardContent>
                    <Space>
                        Set output
                        <Select
                            size="small"
                            options={outputs.map((o, i) => ({
                                key: i,
                                label: o.name,
                                value: i
                            }))}
                            popupMatchSelectWidth={false}
                            value={index}
                            onChange={doutToSet =>
                                onChange({ ...item, setModbusDout: { ...params, doutToSet } })
                            }
                        />
                        to
                        <ModbusDoutMultiple
                            index={index}
                            values={params.valueToSetArray}
                            onChange={values =>
                                onChange({
                                    ...item,
                                    setModbusDout: { ...params, valueToSetArray: values }
                                })
                            }
                        />
                    </Space>
                </StyledEditTabCardContent>
            )
        },
        {
            ...FlowEditorTabs.triggers,
            children: (
                <FlowEditTriggersForActivity
                    triggers={item.triggers || []}
                    startActionOnly
                    onChange={triggers => onChange({ ...item, triggers })}
                />
            )
        }
    ]

    return <Tabs items={tabs} />
}
