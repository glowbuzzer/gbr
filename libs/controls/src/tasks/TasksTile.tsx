import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button, Tag } from "antd"
import { TaskState, useTask, useTaskStatus } from "@glowbuzzer/store"
import styled from "styled-components"
import { CaretRightOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"

const StyledTaskItem = styled.div`
    padding: 4px 0;
    width: 100%;
    display: flex;
    gap: 5px;
    align-items: center;

    div:first-child {
        flex-grow: 1;
    }

    .ant-tag {
        border: 1px dashed #a0a0a0;
        user-select: none;
    }

    .ant-btn {
        padding: 0 8px;
        height: inherit;
    }
`

const TaskItem = ({ status, index }) => {
    const task = useTask(index)

    return (
        <StyledTaskItem>
            <div>{task.name}</div>
            <div>
                <Tag>{TaskState[status.state]}</Tag>
            </div>
            <div>
                {status.state === TaskState.NOTSTARTED && (
                    <Button onClick={() => task.run()}>
                        <CaretRightOutlined />
                    </Button>
                )}
                {status.state === TaskState.RUNNING && (
                    <Button onClick={() => task.cancel()}>
                        <StopIcon />
                    </Button>
                )}
                {(status.state === TaskState.FINISHED || status.state === TaskState.CANCELLED) && (
                    <Button onClick={() => task.reset()}>
                        <ReloadOutlined />
                    </Button>
                )}
            </div>
        </StyledTaskItem>
    )
}

export const TasksTile = () => {
    const status = useTaskStatus()
    return (
        <Tile title="Tasks">
            {/*
little attempt at animated conveyor
            <svg viewBox="0 0 300 300" width={100} height={100}>
                <g>
                    <circle cx="100" cy="50" r="50" fill="rgb(200,100,100)" />
                    <line x1="100" y1="50" x2="50" y2="50" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="150" y2="50" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="100" y2="45" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="100" y2="55" stroke="black" strokeWidth={2} />

                    <line x1="100" y1="50" x2="65" y2="165" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="135" y2="135" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="65" y2="135" stroke="black" strokeWidth={2} />
                    <line x1="100" y1="50" x2="135" y2="165" stroke="black" strokeWidth={2} />
                    <animateTransform
                        attributeType="XML"
                        attributeName="transform"
                        type="rotate"
                        from="0 100 50"
                        to="360 100 50"
                        repeatCount="indefinite"
                        dur="15s"
                    />
                </g>
            </svg>
*/}
            {status.map((t, index) => (
                <TaskItem key={t.name} status={t.status} index={index} />
            ))}
        </Tile>
    )
}
