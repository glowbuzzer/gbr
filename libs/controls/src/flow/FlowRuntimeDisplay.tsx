/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Card, Flex, StepProps, Steps } from "antd"
import { FlowRuntimeControls } from "./FlowRuntimeControls"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { useFlowContext } from "./FlowContextProvider"
import styled from "styled-components"
import { FlowState } from "./runtime/types"
import { Flow, useFlows } from "@glowbuzzer/store"
import { FlowTriggerDisplay } from "./display/FlowTriggerDisplay"
import { FlowActivityDisplay } from "./display/FlowActivityDisplay"

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

    .ant-steps-item-title {
        line-height: 24px !important;
    }
`

type FlowRuntimeFlowDisplayProps = {
    flow: Flow
    tag?: number
    state?: FlowState
}

const FlowRuntimeFlowDisplay = ({ flow, tag, state }: FlowRuntimeFlowDisplayProps) => {
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
            {flow.activities.map((activity, index) => {
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

export const FlowRuntimeDisplay = () => {
    const flows = useFlows()
    const { activeFlow, completedFlows, state, tag, close } = useFlowContext()

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
                    {completedFlows.map((flow, index) => (
                        <Card key={index} size="small" title={`Completed Flow: "${flow.name}"`}>
                            <FlowRuntimeFlowDisplay flow={flow} />
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
                            ) : (
                                <FlowRuntimeFlowDisplay flow={activeFlow} tag={tag} state={state} />
                            )}
                        </Card>
                    )}
                    {close && (
                        <Button size="small" onClick={close}>
                            Done
                        </Button>
                    )}
                </Flex>
            </StyledDiv>
        </DockTileWithToolbar>
    )
}
