import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button, Tag } from "antd"
import { TASK_STATE, useTask, useTaskStatus } from "@glowbuzzer/store"
import styled from "@emotion/styled"
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
                <Tag>{TASK_STATE[status.state]}</Tag>
            </div>
            <div>
                {status.state === TASK_STATE.TASK_NOTSTARTED && (
                    <Button onClick={() => task.run()}>
                        <CaretRightOutlined />
                    </Button>
                )}
                {status.state === TASK_STATE.TASK_RUNNING && (
                    <Button onClick={() => task.cancel()}>
                        <StopIcon />
                    </Button>
                )}
                {(status.state === TASK_STATE.TASK_FINISHED ||
                    status.state === TASK_STATE.TASK_CANCELLED) && (
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
    // console.log("STATUS", status)
    return (
        <Tile title="Tasks">
            {status.map((t, index) => (
                <TaskItem key={t.name} status={t.status} index={index} />
            ))}
        </Tile>
    )
}