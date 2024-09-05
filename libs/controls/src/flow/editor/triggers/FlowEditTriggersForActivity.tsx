/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { TRIGGERACTION, TRIGGERON, TriggerParams, TRIGGERTYPE } from "@glowbuzzer/store"
import { Button, Card, Flex, Select, Space } from "antd"
import { toEnumString } from "../../util"
import styled from "styled-components"
import { DeleteOutlined } from "@ant-design/icons"
import { TriggerEditProps } from "../common/types"
import { FlowEditTriggerParams } from "./FlowEditTriggerParams"
import { FlowEditTriggerOnDropdown } from "./FlowEditTriggerOnDropdown"
import { update_trigger_type, useEnabledTriggerOnOptions } from "../common/util"
import { FlowTriggerDisplay } from "../../display/FlowTriggerDisplay"

const StyledTriggerTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    > div:first-child {
        flex-grow: 1;
    }
    .trigger-display {
        opacity: 0.7;
    }
`

const FlowEditTriggerSettingsCard = ({
    trigger,
    startActionOnly,
    onChange,
    onDelete
}: TriggerEditProps & {
    startActionOnly: boolean
    onDelete: () => void
}) => {
    const enabledTriggerOnOptions = useEnabledTriggerOnOptions()

    const { action, type } = trigger

    return (
        <Card
            size="small"
            title={
                <StyledTriggerTitle>
                    <div>Trigger</div>
                    <FlowTriggerDisplay trigger={trigger} />
                    <DeleteOutlined onClick={onDelete} />
                </StyledTriggerTitle>
            }
        >
            <Space>
                {startActionOnly ? (
                    "START"
                ) : (
                    <Select
                        size="small"
                        value={action}
                        popupMatchSelectWidth={false}
                        onChange={action => onChange({ ...trigger, action })}
                    >
                        {[
                            TRIGGERACTION.TRIGGERACTION_START,
                            TRIGGERACTION.TRIGGERACTION_CANCEL
                        ].map(v => (
                            <Select.Option key={v} value={v}>
                                {toEnumString(TRIGGERACTION[v])}
                            </Select.Option>
                        ))}
                    </Select>
                )}
                after
                <FlowEditTriggerOnDropdown
                    type={type}
                    onChange={type =>
                        onChange({
                            ...trigger,
                            type
                        })
                    }
                    enabledOptions={enabledTriggerOnOptions}
                />
                <FlowEditTriggerParams trigger={trigger} onChange={onChange} />
            </Space>
        </Card>
    )
}

type FlowEditTriggersProps = {
    triggers: TriggerParams[]
    startActionOnly?: boolean
    onChange(triggers: TriggerParams[]): void
}

export const FlowEditTriggersForActivity = ({
    triggers,
    startActionOnly,
    onChange
}: FlowEditTriggersProps) => {
    function delete_trigger(index: number) {
        onChange(triggers.filter((_, i) => i !== index))
    }

    function update_trigger(trigger: TriggerParams, index: number, existingType: TRIGGERON) {
        const next = update_trigger_type(trigger, existingType)
        onChange(triggers.map((t, i) => (i === index ? next : t)))
    }

    return (
        <Flex vertical gap="small">
            <div>You can add up to three triggers for an activity</div>

            {triggers.map((trigger, index) => {
                const existing_type = triggers[index].type
                return (
                    <FlowEditTriggerSettingsCard
                        key={index}
                        trigger={trigger}
                        startActionOnly={startActionOnly}
                        onChange={trigger => update_trigger(trigger, index, existing_type)}
                        onDelete={() => delete_trigger(index)}
                    />
                )
            })}

            <div>
                <Button
                    size="small"
                    onClick={() =>
                        onChange([
                            ...triggers,
                            {
                                action: TRIGGERACTION.TRIGGERACTION_START,
                                type: TRIGGERON.TRIGGERON_DIGITAL_INPUT,
                                digital: {
                                    input: 0,
                                    when: TRIGGERTYPE.TRIGGERTYPE_RISING
                                }
                            }
                        ])
                    }
                    disabled={triggers.length === 3}
                >
                    Add Trigger
                </Button>
            </div>
        </Flex>
    )
}
