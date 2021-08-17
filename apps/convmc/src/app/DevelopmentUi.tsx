import React, { useEffect } from "react"
import { SimpleTileDefinition, SimpleTileLayout, Tile } from "@glowbuzzer/layout"
import { ConnectTile, DevToolsTile, TelemetryTile } from "@glowbuzzer/controls"
import { Button, Space, Tag } from "antd"
import { useDigitalInputs, useDigitalOutput, useJoints } from "@glowbuzzer/store"
import { DigitalInputOverrideTile } from "../components/DigitalInputOverrides"
import { dinLabels } from "./labels"
import { ConveyorsTile } from "../components/ConveyorsTile"
import { TriggersTile } from "./TriggersTile"
import { useApp } from "./AppContext"
import { JobAnimation } from "./JobAnimation"
import { ConveyorControlMotion } from "./ConveyorControlMotion"
import { TestAnimation } from "./TestAnimation"

const DevelopmentUiTile = () => {
    const dins = useDigitalInputs()
    const doutExtend = useDigitalOutput(8)
    const doutRetract = useDigitalOutput(9)
    const app = useApp()
    const [j1, j2] = useJoints()

    const extending = doutExtend.actState > 0
    const retracting = doutRetract.actState > 0
    const [extended, retracted] = dins // simple booleans

    useEffect(() => {
        if (app.running) {
            // don't interfere with running app
            return
        }
        if (extended) {
            doutExtend.set(0)
        }
        if (retracted) {
            doutRetract.set(0)
        }
    }, [app.running, extended, retracted, doutExtend, doutRetract])

    return (
        <Tile title="Development UI">
            <Space direction="vertical">
                {/*
                <TestAnimation c1={j1?.actPos} c2={j2?.actPos} />
*/}
                <JobAnimation c1={j1?.actPos} c2={j2?.actPos} />
                {app.running ? (
                    <>
                        <Button onClick={() => app.setRunning(false)}>Stop App</Button>
                        <div>{app.state}</div>
                    </>
                ) : (
                    <>
                        <Button onClick={() => app.setRunning(true)}>Run App</Button>
                        <Space>
                            <Button
                                onClick={() => doutExtend.set(1)}
                                disabled={extending || extended || retracting}
                            >
                                Extend
                            </Button>
                            <Button
                                onClick={() => doutRetract.set(1)}
                                disabled={retracting || retracted || extending}
                            >
                                Retract
                            </Button>
                            <Tag>
                                {extending
                                    ? "Extending..."
                                    : retracting
                                    ? "Retracting..."
                                    : extended
                                    ? "Extended"
                                    : retracted
                                    ? "Retracted"
                                    : "Unknown"}
                            </Tag>
                        </Space>
                        <ConveyorControlMotion index={0} step={500} />
                        <ConveyorControlMotion index={1} step={100} />
                    </>
                )}
            </Space>
        </Tile>
    )
}

export const DevelopmentUi = () => {
    const tiles: SimpleTileDefinition[][] = [
        [
            { render: <ConnectTile />, height: 4, title: "Connection" },
            { render: <DevToolsTile />, height: 4, title: "Dev Tools" },
            {
                render: <DigitalInputOverrideTile labels={dinLabels} />,
                height: 4,
                title: "Dev Tools"
            }
        ],
        [
            { render: <DevelopmentUiTile />, height: 4, title: "Development UI" },
            { render: <TriggersTile />, height: 4, title: "Triggers" },
            { render: <ConveyorsTile />, height: 4, title: "Conveyors" },
            { render: <TelemetryTile />, height: 4, title: "Telemetry" }
        ]
    ]

    return <SimpleTileLayout appId="convmc-devel" tiles={tiles} widths={[2, 6]} />
}
