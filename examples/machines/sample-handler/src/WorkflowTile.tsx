import styled from "styled-components"
import {
    ActivityApi,
    STREAMCOMMAND,
    STREAMSTATE,
    useSoloActivity,
    useStateMachine,
    useStream
} from "@glowbuzzer/store"
import { appSlice, SampleLocation, useSampleState } from "./store"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { sample_positions } from "./constants"
import { Button, Space, Switch, Tag } from "antd"
import { StateMachineViewer } from "../../../util/StateMachineViewer"

const StyledDiv = styled.div`
    padding: 10px;
    height: 100%;

    display: flex;
    flex-direction: column;

    .viewer {
        flex-grow: 1;
    }
`

export const WorkflowTile = () => {
    const { execute, sendCommand, state: streamState } = useStream(0)
    const spindle = useSoloActivity(1)
    const lid = useSoloActivity(2)
    const dispatch = useDispatch()
    const [jobEnabled, setJobEnabled] = useState(false)
    const { trackingCamera, centrifugeRunning } = useSampleState()

    function set_location(location: SampleLocation) {
        dispatch(appSlice.actions.setLocation(location))
    }

    function set_tracking_camera(tracking: boolean) {
        dispatch(appSlice.actions.setTrackingCamera(tracking))
    }

    function set_centrifuge_running(run: boolean) {
        dispatch(appSlice.actions.setCentrifugeRunning(run))
    }

    function close_lid() {
        return lid.moveJoints([0]).promise()
    }

    function open_lid() {
        return lid.moveJoints([-0.4]).promise()
    }

    // helper to approach and retreat to/from a location and either pick or place the sample tube
    function approach_retreat(
        api: ActivityApi,
        location: SampleLocation,
        pick: boolean,
        safe_z: number
    ) {
        const pos = sample_positions[location]
        const [x, y, z] = pos
        return [safe_z, 0, safe_z].map((y_offset, index) => {
            return api
                .moveToPosition(x, y + y_offset, z)
                .frameIndex(0)
                .promise()
                .then(result => {
                    if (index === 1 && result.completed) {
                        console.log("set location to", index, location)
                        set_location(pick ? SampleLocation.ROBOT : location)
                    }
                })
        })
    }

    async function scan_barcode(api: ActivityApi) {
        const pos = sample_positions[SampleLocation.CAMERA]
        const [x, y, z] = pos
        await api.moveToPosition(x, y, z).frameIndex(0).promise()
        set_location(SampleLocation.CAMERA)
        await spindle
            .moveJoints([-Math.PI])
            .params({
                vmaxPercentage: 25
            })
            .promise()
        set_location(SampleLocation.ROBOT)
    }

    const { currentState, definition } = useStateMachine(
        {
            idle: {
                label: "Idle",
                enter: async function () {
                    sendCommand(STREAMCOMMAND.STREAMCOMMAND_STOP)
                    set_centrifuge_running(false)
                    await spindle.cancel().promise()
                    sendCommand(STREAMCOMMAND.STREAMCOMMAND_RUN)
                },
                transitions: {
                    start: jobEnabled
                }
            },
            start: {
                label: "Start",
                enter: async () => {
                    await Promise.allSettled([
                        await close_lid(),
                        await spindle.moveJoints([0]).promise()
                    ])
                    dispatch(appSlice.actions.setLocation(SampleLocation.PICK))
                    return "pick"
                },
                implicitTransitions: ["pick"]
            },
            pick: {
                label: "Pick",
                enter: async () => {
                    await execute(api => approach_retreat(api, SampleLocation.PICK, true, 0.27))
                    return "scan"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["scan"]
            },
            scan: {
                label: "Scan Barcode",
                enter: async () => {
                    await execute(api => scan_barcode(api))
                    return "centrifuge"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["centrifuge"]
            },
            centrifuge: {
                label: "Centrifuge",
                enter: async () => {
                    await open_lid()
                    await execute(api =>
                        approach_retreat(api, SampleLocation.CENTRIFUGE, false, 0.27)
                    )
                    await close_lid()
                    set_centrifuge_running(true)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    set_centrifuge_running(false)
                    await open_lid()
                    await execute(api =>
                        approach_retreat(api, SampleLocation.CENTRIFUGE, true, 0.27)
                    )
                    return "place"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["place"]
            },
            place: {
                label: "Place",
                enter: async () => {
                    await execute(api => approach_retreat(api, SampleLocation.PLACE, false, 0.27))
                    return "end"
                },
                transitions: {
                    idle: !jobEnabled
                },
                implicitTransitions: ["end"]
            },
            end: {
                label: "End",
                enter: () => {
                    setJobEnabled(false)
                    return "idle"
                },
                implicitTransitions: ["idle"]
            }
        },
        "idle",
        [jobEnabled]
    )

    return (
        <StyledDiv>
            <Space direction="vertical">
                {/*
                <Space>
                    {[
                        SampleLocation.PICK,
                        SampleLocation.CAMERA,
                        SampleLocation.CENTRIFUGE,
                        SampleLocation.PLACE,
                        SampleLocation.ROBOT
                    ].map(location => (
                        <Button key={location} onClick={() => set_location(location)}>
                            SHOW {location}
                        </Button>
                    ))}
                </Space>
*/}
                {/*
                <Space>
                    <Button onClick={open_lid}>Open Lid</Button>
                    <Button onClick={close_lid}>Close Lid</Button>
                </Space>
*/}
                <Space>
                    <Button onClick={() => setJobEnabled(true)}>Start Job</Button>
                    <Button onClick={() => setJobEnabled(false)}>Cancel</Button>{" "}
                    <div>
                        Tracking Camera{" "}
                        <Switch value={trackingCamera} onChange={set_tracking_camera} />
                    </div>
                </Space>
                {/*
                <Space></Space>
*/}
                {/*
                <Space>
                    Centrifuge Running{" "}
                    <Switch value={centrifugeRunning} onChange={set_centrifuge_running} />
                </Space>
                <Space>Current Workflow State: {currentState}</Space>
*/}
                <Space>
                    Current Stream State: <Tag>{STREAMSTATE[streamState]}</Tag>
                </Space>
                {/*
                {jobEnabled && <Tag color="green">RUNNING</Tag>}
*/}
            </Space>
            <div className="viewer">
                <StateMachineViewer definition={definition} currentState={currentState} />
            </div>
        </StyledDiv>
    )
}
