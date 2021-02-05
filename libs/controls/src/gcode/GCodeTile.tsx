import * as React from "react"
import { useEffect } from "react"
import AceEditor, { IMarker } from "react-ace"

import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/mode-gcode"
import "ace-builds/src-noconflict/mode-text"
import { Tile } from "@glowbuzzer/layout"
import { Radio, Space, Tag } from "antd"
import { StreamCommand, StreamState, useGCode, usePrefs, usePreview } from "@glowbuzzer/store"
import styled, { css } from "styled-components"
import { GCodeSettings } from "./GCodeSettings"
import { CaretRightOutlined, PauseOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"

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

    const active = stream.state !== StreamState.IDLE

    useEffect(() => {
        preview.setGCode(gcode)
        // eslint-disable-next-line
    }, [])

    function send_gcode() {
        setGCodeLS(gcode)
        stream.send(gcode + (prefs.current.send_m2 ? " M2" : ""))
    }

    function update_gcode(gcode: string) {
        setGCode(gcode)
        preview.setGCode(gcode)
    }

    function update_cursor(e) {
        // console.log(e.cursor.row)
        preview.setHighlightLine(e.cursor.row)
    }

    const highlight: IMarker[] = active
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

    const inferredCommand = (() => {
        switch (stream.state) {
            case StreamState.IDLE:
                return undefined
            case StreamState.ACTIVE:
                return StreamCommand.RUN
            case StreamState.PAUSED:
                return StreamCommand.PAUSE
            case StreamState.STOPPING:
            case StreamState.STOPPED:
                return StreamCommand.STOP
        }
    })()

    const needs_reset = stream.state === StreamState.STOPPING || stream.state === StreamState.STOPPED
    const can_stop = !needs_reset && stream.state !== StreamState.IDLE
    const can_pause = stream.state === StreamState.ACTIVE

    function send_command(v) {
        stream.setState(v.target.value)
        if (stream.state === StreamState.IDLE && v.target.value === StreamCommand.RUN) {
            console.log("send gcode")
            send_gcode()
        }
    }

    return (
        <Tile
            title="GCode Sender"
            settings={<GCodeSettings />}
            controls={
                <>
                    <Space>
                        <span>{(stream.time / 1000).toFixed(1)}s</span>
                        <Tag>{StreamState[stream.state]}</Tag>

                        <Radio.Group optionType="button" onChange={send_command} value={inferredCommand}>
                            <Radio.Button disabled={can_pause} value={StreamCommand.RUN}>
                                {needs_reset ? <ReloadOutlined /> : <CaretRightOutlined />}
                            </Radio.Button>
                            <Radio.Button disabled={!can_pause} value={StreamCommand.PAUSE}>
                                <PauseOutlined />
                            </Radio.Button>
                            <Radio.Button disabled={!can_stop} value={StreamCommand.STOP}>
                                <StopIcon />
                            </Radio.Button>
                        </Radio.Group>
                    </Space>
                    &nbsp;&nbsp;
                </>
            }
        >
            <StyledDiv readOnly={active}>
                <AceEditor
                    readOnly={active}
                    mode="gcode"
                    theme="github"
                    width={"100%"}
                    height={"100%"}
                    value={gcode}
                    onChange={update_gcode}
                    onCursorChange={update_cursor}
                    markers={highlight}
                />
            </StyledDiv>
        </Tile>
    )
}
