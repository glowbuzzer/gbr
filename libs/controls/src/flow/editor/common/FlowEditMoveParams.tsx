/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { BLENDTYPE, MoveParametersConfig, SYNCTYPE } from "@glowbuzzer/store"
import { Button, Card, Flex, Space } from "antd"
import { PrecisionInput } from "../../../util/components/PrecisionInput"
import { StyledEditTabCardContent } from "../styles"
import { FlowEditTabTitleRadioGroup } from "./FlowEditTabTitleRadioGroup"

type FlowEditMoveParamsProps = {
    params: MoveParametersConfig
    onChange: (params: MoveParametersConfig) => void
}
export const FlowEditMoveParams = ({ params, onChange }: FlowEditMoveParamsProps) => {
    if (!params) {
        return (
            <Space direction="vertical">
                <div>All move parameters use defaults</div>
                <Button size="small" onClick={() => onChange({})}>
                    Specify Parameters
                </Button>
            </Space>
        )
    }

    function update_property(name: string) {
        return function (value: number) {
            onChange({
                ...params,
                [name]: value
            })
        }
    }

    function update_blend_type(blendType: BLENDTYPE) {
        const blendTimePercentage =
            blendType === BLENDTYPE.BLENDTYPE_OVERLAPPED
                ? params.blendTimePercentage || 100
                : undefined

        onChange({
            ...params,
            blendType,
            blendTimePercentage
        })
    }

    function switch_kinematic_constraints_on_off(value: boolean) {
        if (value) {
            onChange({
                ...params,
                vmaxPercentage: has_kinematic_constraints ? undefined : 100,
                amaxPercentage: has_kinematic_constraints ? undefined : 100,
                jmaxPercentage: has_kinematic_constraints ? undefined : 100
            })
        } else {
            onChange({
                ...params,
                vmaxPercentage: undefined,
                amaxPercentage: undefined,
                jmaxPercentage: undefined
            })
        }
    }

    function update_duration(syncType: SYNCTYPE) {
        const syncValue =
            syncType === SYNCTYPE.SYNCTYPE_DURATION_MS ? params.syncValue || 5000 : undefined

        onChange({
            ...params,
            syncType,
            syncValue
        })
    }

    const has_kinematic_constraints = params.vmaxPercentage !== undefined

    return (
        <StyledEditTabCardContent>
            <Flex vertical gap="small">
                <Space>
                    <Button size="small" onClick={() => onChange(undefined)}>
                        Clear
                    </Button>
                </Space>
                <Card
                    size="small"
                    title={
                        <FlowEditTabTitleRadioGroup
                            title="Kinematic Constraints"
                            value={has_kinematic_constraints}
                            onChange={switch_kinematic_constraints_on_off}
                            options={[
                                { value: false, label: "DEFAULT" },
                                { value: true, label: "SPECIFIED" }
                            ]}
                        />
                    }
                >
                    {has_kinematic_constraints ? (
                        <Space>
                            <Space>
                                <span>Vel Max</span>
                                <PrecisionInput
                                    value={params.vmaxPercentage}
                                    onChange={update_property("vmaxPercentage")}
                                    precision={0}
                                />
                            </Space>
                            <Space>
                                <span>Acc Max</span>
                                <PrecisionInput
                                    value={params.amaxPercentage}
                                    onChange={update_property("amaxPercentage")}
                                    precision={0}
                                />
                            </Space>
                            <Space>
                                <span>Jerk Max</span>
                                <PrecisionInput
                                    value={params.jmaxPercentage}
                                    onChange={update_property("jmaxPercentage")}
                                    precision={0}
                                />
                                %
                            </Space>
                        </Space>
                    ) : (
                        <div>Kinematic constraints use defaults</div>
                    )}
                </Card>
                <Card
                    size="small"
                    title={
                        <FlowEditTabTitleRadioGroup
                            title="Blending"
                            value={params.blendType}
                            onChange={update_blend_type}
                            options={[
                                { value: undefined, label: "DEFAULT" },
                                { value: BLENDTYPE.BLENDTYPE_NONE, label: "NOT BLENDED" },
                                { value: BLENDTYPE.BLENDTYPE_OVERLAPPED, label: "BLENDED" }
                            ]}
                        />
                    }
                >
                    {params.blendType === undefined ? (
                        <div>Blending uses defaults</div>
                    ) : params.blendType === BLENDTYPE.BLENDTYPE_NONE ? (
                        <div>Blending is disabled</div>
                    ) : params.blendType === BLENDTYPE.BLENDTYPE_OVERLAPPED ? (
                        <Space>
                            Profile overlap
                            <PrecisionInput
                                value={params.blendTimePercentage}
                                onChange={update_property("blendTimePercentage")}
                                precision={0}
                            />
                            <div>% (where possible)</div>
                        </Space>
                    ) : (
                        <div>Blending is not enabled.</div>
                    )}
                </Card>
                <Card
                    size="small"
                    title={
                        <FlowEditTabTitleRadioGroup
                            title="Duration"
                            value={params.syncType}
                            onChange={update_duration}
                            options={[
                                { value: undefined, label: "DEFAULT" },
                                { value: SYNCTYPE.SYNCTYPE_NONE, label: "MIN TIME" },
                                { value: SYNCTYPE.SYNCTYPE_DURATION_MS, label: "SPECIFIED" }
                            ]}
                        />
                    }
                >
                    {params.syncType === undefined ? (
                        <div>Duration uses default (typically minimum time)</div>
                    ) : params.syncType === SYNCTYPE.SYNCTYPE_NONE ? (
                        <div>Move will complete in minimum time</div>
                    ) : (
                        <Space>
                            <span>Move will complete in</span>
                            <PrecisionInput
                                value={params.syncValue}
                                onChange={update_property("syncValue")}
                                precision={0}
                                step={500}
                            />
                            <div>ms</div>
                        </Space>
                    )}
                </Card>
            </Flex>
        </StyledEditTabCardContent>
    )
}
