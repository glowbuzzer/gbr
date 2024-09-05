/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useFlowEdit } from "./FlowEditModal"
import { Input, InputNumber, Select, Space, Tabs, TabsProps } from "antd"
import { FlowEditorTabs } from "./util"
import { FlowEditTriggersForActivity } from "./triggers/FlowEditTriggersForActivity"
import * as React from "react"
import { StyledEditTabCardContent } from "./styles"
import { PrecisionInput } from "../../util"
import { useModbusDigitalOutputList, useModbusIntegerOutputList } from "@glowbuzzer/store"

const ModbusUioutMultiple = ({ index, values, onChange }) => {
    const outputs = useModbusIntegerOutputList()
    const config = outputs[index]
    if (!config) {
        return "Invalid output, please select another"
    }

    const count = config.endAddress - config.startAddress + 1
    const array = Array.from({ length: count }, (_, i) => values[i] || 0)

    return array.map((v, i) => (
        <InputNumber
            key={i}
            size="small"
            value={v}
            onChange={v => onChange(array.map((v1, j) => (i === j ? v : v1)))}
        />
    ))
}

export const FlowEditorSetModbusUiout = () => {
    const { item, onChange } = useFlowEdit()
    const outputs = useModbusDigitalOutputList()
    const params = item.setModbusUiout
    const index = params.uioutToSet

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
                            onChange={uioutToSet =>
                                onChange({ ...item, setModbusUiout: { ...params, uioutToSet } })
                            }
                        />
                        to
                        <ModbusUioutMultiple
                            index={index}
                            values={params.valueToSetArray}
                            onChange={values =>
                                onChange({
                                    ...item,
                                    setModbusUiout: { ...params, valueToSetArray: values }
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
