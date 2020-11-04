import * as React from "react"
import { useEffect, useState } from "react"
import { Tile } from "@glowbuzzer/layout"
import { Button, Slider } from "antd"
import { useDevTools } from "@glowbuzzer/store"

export const DevToolsTile = () => {
    const devtools = useDevTools()

    const [frequency, setFrequency] = useState(devtools.statusFrequency)

    useEffect(() => {
        setFrequency(devtools.statusFrequency)
    }, [devtools.statusFrequency])

    function send_frequency(v) {
        devtools.setStatusFrequency(v)
    }

    return (
        <Tile title="Developer Tools">
            <Slider
                tipFormatter={null}
                value={frequency}
                onChange={setFrequency}
                onAfterChange={send_frequency}
                min={0}
                max={100}
                step={25}
                marks={{
                    0: "Low",
                    50: "Medium",
                    100: "High"
                }}
            />
        </Tile>
    )
}
