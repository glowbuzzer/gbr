import * as React from "react"
import { useTelemetry } from "@glowbuzzer/store"
import { SparklineDynamic } from "./SparklineDynamic"
import { SparklineScrolling } from "./SparklineScrolling"
import { Tile } from "@glowbuzzer/layout"
import { TileSettings } from "@glowbuzzer/layout"

const TelemetrySettings = () => {
    function save() {
        console.log("SAVE")
    }

    return <TileSettings onConfirm={save}>THIS IS IN TELEM SETTINGS</TileSettings>
}

export const TelemetryTile = () => {
    const telemetry = useTelemetry()

    // console.log("DATA", telemetry)
    return (
        <Tile title="Telemetry" settings={<TelemetrySettings />}>
            <SparklineScrolling />
            {/*
            <SparklineDynamic duration={500} width={100} height={100} data={telemetry} layout={[]} />
*/}
        </Tile>
    )
}
