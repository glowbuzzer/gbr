/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Button, Tag } from "antd"
import { TASK_STATE, TaskStatus, useTask, useTaskStatus } from "@glowbuzzer/store"
import styled from "styled-components"
import { CaretRightOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"
import { StyledTileContent } from "../util/styles/StyledTileContent"

export const TasksTileHelp = () => (
    <div>
        <h4>Tasks Tile</h4>
        <p>The Tasks Tile shows the configured tasks and allows the user to start and stop them.</p>
    </div>
)

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

const TaskItem = ({ name, status, index }: { name: string; status: TaskStatus; index: number }) => {
    const task = useTask(index)

    return (
        <StyledTaskItem>
            <div>{name}</div>
            <div>
                <Tag>{TASK_STATE[status.taskState]}</Tag>
            </div>
            <div>
                {status.taskState === TASK_STATE.TASK_NOTSTARTED && (
                    <Button onClick={() => task.run()}>
                        <CaretRightOutlined />
                    </Button>
                )}
                {status.taskState === TASK_STATE.TASK_RUNNING && (
                    <Button onClick={() => task.cancel()}>
                        <StopIcon />
                    </Button>
                )}
                {(status.taskState === TASK_STATE.TASK_FINISHED ||
                    status.taskState === TASK_STATE.TASK_CANCELLED) && (
                    <Button onClick={() => task.reset()}>
                        <ReloadOutlined />
                    </Button>
                )}
            </div>
        </StyledTaskItem>
    )
}

/**
 * The tasks tile shows the current status of all tasks in the configuration and allows you to start and stop tasks.
 */
export const TasksTile = () => {
    const status = useTaskStatus()
    return (
        <StyledTileContent>
            {status.map((t, index) => (
                <TaskItem key={t.name} name={t.name} status={t.status} index={index} />
            ))}
        </StyledTileContent>
    )
}
