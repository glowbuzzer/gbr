import React, { useEffect } from "react"
import { SimpleTileDefinition, SimpleTileLayout, Tile } from "@glowbuzzer/layout"
import { ConnectTile, DevToolsTile, TelemetryTile } from "@glowbuzzer/controls"
import { Button, Space, Tag } from "antd"
import { useDigitalInputs, useDigitalOutputState, useJoint } from "@glowbuzzer/store"
import { DigitalInputOverrideTile } from "../components/DigitalInputOverrides"
import { dinLabels } from "./labels"
import { ConveyorsTile } from "../components/ConveyorsTile"
import { TriggersTile } from "./TriggersTile"
import { useApp } from "./AppContext"
import { JobAnimation } from "./JobAnimation"
import { ConveyorControlMotion } from "./ConveyorControlMotion"

const DevelopmentUiTile = () => {
    const dins = useDigitalInputs()
    const [doutExtend, setDoutExtend] = useDigitalOutputState(8)
    const [doutRetract, setDoutRetract] = useDigitalOutputState(9)
    const app = useApp()
    const j1 = useJoint(0)
    const j2 = useJoint(1)

    const extending = doutExtend.effectiveValue
    const retracting = doutRetract.effectiveValue
    const [extended, retracted] = dins // simple booleans

    useEffect(() => {
        if (app.running) {
            // don't interfere with running app
            return
        }
        if (extended) {
            setDoutExtend(false, true)
        }
        if (retracted) {
            setDoutRetract(false, true)
        }
    }, [app.running, extended, retracted, doutExtend, doutRetract, setDoutExtend, setDoutRetract])

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
                                onClick={() => setDoutExtend(true, true)}
                                disabled={extending || extended || retracting}
                            >
                                Extend
                            </Button>
                            <Button
                                onClick={() => setDoutRetract(true, true)}
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
