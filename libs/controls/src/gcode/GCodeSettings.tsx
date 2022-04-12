import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { TileSettings } from "../tiles"
import { GCodeSettingsType, gcodeSlice, useGCodeSettings } from "@glowbuzzer/store"
import { Checkbox } from "antd"

export const GCodeSettings = () => {
    const initialSettings = useGCodeSettings()
    const dispatch = useDispatch()
    const [settings, setSettings] = useState<GCodeSettingsType>(initialSettings)

    function save() {
        dispatch(gcodeSlice.actions.settings(settings))
    }

    function update_settings(change: Partial<GCodeSettingsType>) {
        setSettings(settings => ({ ...settings, ...change }))
    }

    return (
        <TileSettings onConfirm={save} title="GCode Settings">
            <Checkbox
                checked={settings.sendEndProgram}
                onChange={() => update_settings({ sendEndProgram: !settings.sendEndProgram })}
            >
                Send End Program
            </Checkbox>
        </TileSettings>
    )
}
