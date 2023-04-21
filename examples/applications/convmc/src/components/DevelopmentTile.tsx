/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useDigitalInputs, useDigitalOutputState, useJoint } from "@glowbuzzer/store"
import { useApp } from "../app/AppContext"
import { useEffect } from "react"
import { Button, Space, Tag } from "antd"
import { JobAnimation } from "../app/JobAnimation"
import { ConveyorControlMotion } from "../app/ConveyorControlMotion"

export const DevelopmentTile = () => {
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
        <div style={{ padding: "10px" }}>
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
        </div>
    )
}
