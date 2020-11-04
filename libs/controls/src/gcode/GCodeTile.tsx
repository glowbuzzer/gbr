import * as React from "react"
import AceEditor from "react-ace"

import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/mode-text"
import { Tile } from "@glowbuzzer/layout"
import { Button, Checkbox } from "antd"
import { useGCode } from "../../../store/src/gcode"
import { usePrefs } from "@glowbuzzer/store"

function getGCodeLS() {
    return localStorage.getItem("ui.web-drives.gcode") || "G0 X100 Y100"
}

function setGCodeLS(gcode) {
    return localStorage.setItem("ui.web-drives.gcode", gcode)
}

export const GCodeTile = () => {
    const [gcode, setGCode] = React.useState(getGCodeLS())

    const sender = useGCode()
    const prefs = usePrefs()

    function send_gcode() {
        setGCodeLS(gcode)
        sender.send(gcode + (prefs.current.send_m2 ? " M2" : ""))
    }

    const update_m2_pref = v => {
        prefs.set("send_m2", v.target.checked)
    }

    return (
        <Tile
            title="GCode Sender"
            footer={
                <>
                    <Button onClick={send_gcode}>Send</Button>&nbsp;&nbsp;
                    <Checkbox checked={!!prefs.current.send_m2} onChange={update_m2_pref}>
                        Send End Program
                    </Checkbox>
                </>
            }
        >
            <AceEditor readOnly={false} theme="github" mode="text" width={"100%"} height={"100%"} value={gcode} onChange={value => setGCode(value)} />
        </Tile>
    )
}
