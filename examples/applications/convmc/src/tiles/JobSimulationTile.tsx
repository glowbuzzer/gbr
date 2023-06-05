/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { Button, Space } from "antd"
import { useDispatch } from "react-redux"
import { appSlice, ObjectType, useAppState } from "../store"

export const JobSimulationTile = () => {
    const { jobEnabled } = useAppState()
    const dispatch = useDispatch()
    const { objectType } = useAppState()

    const can_drop = objectType === ObjectType.NONE

    function drop_duck() {
        dispatch(appSlice.actions.drop(ObjectType.DUCK))
    }

    function drop_car() {
        dispatch(appSlice.actions.drop(ObjectType.CAR))
    }

    function toggle_run() {
        dispatch(appSlice.actions.setJobEnabled(!jobEnabled))
    }

    return (
        <div style={{ padding: "10px" }}>
            <p>
                Here you can run the sorting job and simulate different objects being dropped on the
                conveyor.
            </p>
            <p>Start the first conveyor running by clicking the Run button.</p>
            <p>
                Once the conveyor is running, you can drop a duck or a car onto the conveyor to be
                sorted.
            </p>
            <p>
                Ducks will stay and be ejected on the first conveyor. Cars will be detected by the
                camera and will be pushed onto the second conveyor before being ejected.
            </p>
            <p>The state viewer tile on the right shows the current state of the workflow.</p>
            <Space>
                <Button onClick={toggle_run}>{jobEnabled ? "Stop" : "Run"}</Button>
                <Button onClick={drop_duck} disabled={!can_drop}>
                    Drop Duck
                </Button>
                <Button onClick={drop_car} disabled={!can_drop}>
                    Drop Car
                </Button>
            </Space>
        </div>
    )
}
