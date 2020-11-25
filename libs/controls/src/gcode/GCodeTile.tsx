import * as React from "react"
import AceEditor from "react-ace"

import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/mode-gcode"
import "ace-builds/src-noconflict/mode-text"
import { Tile } from "@glowbuzzer/layout"
import { Button, Checkbox } from "antd"
import { useGCode, usePrefs, usePreview } from "@glowbuzzer/store"
import { IMarker } from "react-ace"
import styled, { css } from "styled-components"

function getGCodeLS() {
    return localStorage.getItem("ui.web-drives.gcode") || "G0 X100 Y100"
}

function setGCodeLS(gcode) {
    return localStorage.setItem("ui.web-drives.gcode", gcode)
}

const StyledDiv = styled.div<{ readOnly: boolean }>`
    height: 100%;

    ${props =>
        props.readOnly &&
        css`
            pointer-events: none;
            .ace_content,
            .ace-github .ace_marker-layer .ace_active-line {
                background: #f0f0f0;
            }
            .ace_cursor-layer {
                display: none;
            }
        `}

    .gb-ace-highlight {
        background: #d3e5ff;
        position: relative;
    }
`

export const GCodeTile = () => {
    const [gcode, setGCode] = React.useState(getGCodeLS())

    const stream = useGCode()
    const prefs = usePrefs()
    const preview = usePreview()

    function send_gcode() {
        setGCodeLS(gcode)
        stream.send(gcode + (prefs.current.send_m2 ? " M2" : ""))
    }

    function update_gcode(gcode: string) {
        console.log("SET GCODE!")
        preview.setGCode(gcode)
        setGCode(gcode)
    }

    function update_m2_pref(v) {
        prefs.set("send_m2", v.target.checked)
    }

    const highlight: IMarker[] = stream.active
        ? [
              {
                  startRow: stream.lineNum,
                  endRow: stream.lineNum + 1,
                  startCol: 0,
                  endCol: 0,
                  type: "screenLine",
                  className: "gb-ace-highlight"
              }
          ]
        : []

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
            <StyledDiv readOnly={stream.active}>
                <AceEditor
                    readOnly={stream.active}
                    mode="gcode"
                    theme="github"
                    width={"100%"}
                    height={"100%"}
                    value={gcode}
                    onChange={update_gcode}
                    markers={highlight}
                />
            </StyledDiv>
        </Tile>
    )
}
