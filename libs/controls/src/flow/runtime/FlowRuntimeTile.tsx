/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Alert, Button, Card, Flex, StepProps, Steps } from "antd"
import styled from "styled-components"
import { ActivityStreamItem, useFlows } from "@glowbuzzer/store"
import { FlowState } from "./types"
import { FlowActivityDisplay } from "../display/FlowActivityDisplay"
import { useFlowContext } from "../FlowContextProvider"
import { DockTileWithToolbar } from "../../dock/DockTileWithToolbar"
import { FlowRuntimeControls } from "./FlowRuntimeControls"
import { FlowTriggerDisplay } from "../display/FlowTriggerDisplay"
import { useFlowCustomContext } from "../FlowCustomContextProvider"
import { StyledEmpty } from "../styles"
import { useUser } from "../../usermgmt"
import { FlowMakerCapability } from "../FlowMakerCapability"
import { CaretRightOutlined, CloseCircleOutlined } from "@ant-design/icons"

const StyledDiv = styled.div`
    padding: 10px;

    .grid {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr 1fr;
        grid-gap: 10px;
        align-items: center;
    }

    .col3 {
        grid-template-columns: 1fr 3fr 1fr;
    }

    .auto {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .ant-steps-item-title {
        line-height: 24px !important;
    }

    .error {
        color: red;
        display: flex;
        font-size: 1.2em;
        gap: 6px;

        .anticon {
            font-size: 1.4em;
        }
    }
`

type FlowRuntimeFlowDisplayProps = {
    activities: ActivityStreamItem[]
    tag?: number
    state?: FlowState
}

const FlowRuntimeCompletedDisplay = ({ activities }: { activities: ActivityStreamItem[] }) => {
    return (
        <Steps direction="vertical">
            {activities.map((activity, index) => {
                return (
                    <Steps.Step
                        key={index}
                        status="finish"
                        title={
                            <div>
                                <Flex gap="small">
                                    <FlowActivityDisplay item={activity} />
                                </Flex>
                            </div>
                        }
                    />
                )
            })}
        </Steps>
    )
}

const FlowRuntimeFlowDisplay = ({ activities, tag, state }: FlowRuntimeFlowDisplayProps) => {
    const error = state === FlowState.ERROR

    function determine_step_status(index: number, tag?: number): StepProps["status"] {
        if (tag === undefined) {
            return "finish"
        }
        // if (tag && state === FlowState.IDLE) {
        //     // if the flow is idle, then all steps are finished
        //     console.log("flow is idle", tag)
        //     return "finish"
        // }
        const current = index === tag - 1
        const pending = index > tag - 1
        return current ? (error ? "error" : "process") : pending ? "wait" : "finish"
    }
    return (
        <Steps direction="vertical">
            {activities.map((activity, index) => {
                const step_status = determine_step_status(index, tag)
                return (
                    <Steps.Step
                        key={index}
                        status={step_status}
                        title={
                            <div>
                                <Flex gap="small">
                                    <FlowActivityDisplay item={activity} />
                                </Flex>
                            </div>
                        }
                    />
                )
            })}
        </Steps>
    )
}

const FlowRuntimePicker = () => {
    const all_flows = useFlows()
    const { startFlow } = useFlowContext()
    const { hasCapability } = useUser()
    const { enabled, message } = useFlowCustomContext()

    const flows = all_flows.filter(
        flow => !flow.restricted || hasCapability(FlowMakerCapability.EDIT)
    )

    if (!flows.length) {
        return (
            <StyledEmpty>
                <div className="description">
                    No flows defined. Flows allow you to create complex sequences of activities,
                    including dynamic triggers, external integrations and branching
                </div>
            </StyledEmpty>
        )
    }

    return (
        <StyledDiv>
            <Flex vertical gap="small">
                {message && <Alert message={message} type="warning" showIcon />}
                <div className="grid auto">
                    {flows.map((flow, index) => (
                        <Card key={index} title={flow.name} size="small" style={{ height: "100%" }}>
                            <Flex vertical gap="small">
                                {flow.description}
                                <div>
                                    <Button
                                        size="large"
                                        icon={<CaretRightOutlined />}
                                        onClick={() => startFlow(flow)}
                                        disabled={!enabled}
                                    >
                                        Start
                                    </Button>
                                </div>
                            </Flex>
                        </Card>
                    ))}
                </div>
            </Flex>
        </StyledDiv>
    )
}

export const FlowRuntimeTile = () => {
    const flows = useFlows()
    const { active, activeFlow, activities, completedFlows, state, integrationError, tag, close } =
        useFlowContext()
    const { message } = useFlowCustomContext()

    if (!active) {
        return <FlowRuntimePicker />
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <FlowRuntimeControls />
                </>
            }
        >
            <StyledDiv>
                <Flex vertical gap="small">
                    {message && <Alert message={message} type="warning" showIcon />}

                    {completedFlows.map(({ flow, activities }, index) => (
                        <Card key={index} size="small" title={`Completed Flow: "${flow.name}"`}>
                            <FlowRuntimeCompletedDisplay activities={activities} />
                        </Card>
                    ))}
                    {activeFlow && (
                        <Card size="small" title={`Active Flow: "${activeFlow.name}"`}>
                            {state === FlowState.WAITING_ON_TRIGGER ? (
                                <div className="grid col3">
                                    {activeFlow.branches.map((branch, index) => (
                                        <React.Fragment key={index}>
                                            <div>{flows[branch.flowIndex].name}</div>
                                            <FlowTriggerDisplay trigger={branch.trigger} />
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : state === FlowState.ERROR ? (
                                <div className="error">
                                    <CloseCircleOutlined /> {integrationError}
                                </div>
                            ) : (
                                <FlowRuntimeFlowDisplay
                                    activities={activities}
                                    tag={tag}
                                    state={state}
                                />
                            )}
                        </Card>
                    )}
                    {close && <Button onClick={close}>Done</Button>}
                </Flex>
            </StyledDiv>
        </DockTileWithToolbar>
    )
}
