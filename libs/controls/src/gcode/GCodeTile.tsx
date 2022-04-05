import * as React from "react"
import { useEffect } from "react"
import AceEditor from "react-ace"

import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/mode-gcode"
import "ace-builds/src-noconflict/mode-text"

import { Tile } from "@glowbuzzer/layout"
import { Radio, Select, Space, Tag } from "antd"
import {
    settings,
    STREAMCOMMAND,
    STREAMSTATE,
    useConfig,
    useFrames,
    useGCode,
    useKinematicsCartesianPosition,
    useKinematicsOffset,
    usePrefs,
    usePreview
} from "@glowbuzzer/store"
import styled, { css } from "styled-components"

import { GCodeSettings } from "./GCodeSettings"
import { CaretRightOutlined, PauseOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"
// import loadable from "@loadable/component"

// const AceEditor = loadable(async () => {
//     if (typeof window !== "undefined") {
//         const editor = await import("react-ace")
//         // import("ace-builds/src-noconflict/theme-github")
//         // import("ace-builds/src-noconflict/mode-gcode")
//         // import("ace-builds/src-noconflict/mode-text")
//         return editor
//     }
//     return null
// })

const { Option } = Select

const { load, save } = settings("tiles.gcode")

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
    const [gcode, setGCode] = React.useState(load("G1 X10 Y5 Z2"))

    const stream = useGCode()
    const prefs = usePrefs()
    const preview = usePreview()
    const frames = useFrames()
    const active = stream.state !== STREAMSTATE.STREAMSTATE_IDLE
    const workOffset = frames.active
    const config = useConfig()
    const offset = useKinematicsOffset(0)
    const position = useKinematicsCartesianPosition(0)

    // we need to pass linear vmax to gcode interpreter to support F code calcs
    const vmax = Object.values(config.kinematicsConfiguration)[0]?.kinematicsParameters
        .cartesianParameters.linearVmax

    const stream_state = stream.state
    useEffect(() => {
        if (stream_state === STREAMSTATE.STREAMSTATE_IDLE) {
            // we should only update the preview if stream is idle (otherwise whole preview moves while running)
            preview.setGCode("G" + (54 + workOffset) + "\n" + gcode)
        }
        // eslint-disable-next-line
    }, [
        stream_state,
        workOffset,
        position,
        offset,
        gcode,
        frames.overrides,
        config /* extra dep because config can cause frames to change */
    ])

    function send_gcode() {
        save(gcode)
        const offset = "G" + (54 + workOffset)
        stream.send(offset + "\n" + gcode + (prefs.current.send_m2 ? " M2" : ""), vmax)
    }

    function update_gcode(gcode: string) {
        setGCode(gcode)
    }

    function update_cursor(e) {
        // console.log(e.cursor.row)
        preview.setHighlightLine(e.cursor.row + 1)
    }

    const highlight = active
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
            case STREAMSTATE.STREAMSTATE_IDLE:
                return undefined
            case STREAMSTATE.STREAMSTATE_ACTIVE:
                return STREAMCOMMAND.STREAMCOMMAND_RUN
            case STREAMSTATE.STREAMSTATE_PAUSED:
                return STREAMCOMMAND.STREAMCOMMAND_PAUSE
            case STREAMSTATE.STREAMSTATE_STOPPING:
            case STREAMSTATE.STREAMSTATE_STOPPED:
                return STREAMCOMMAND.STREAMCOMMAND_STOP
        }
    })()

    const needs_reset =
        stream.state === STREAMSTATE.STREAMSTATE_STOPPING ||
        stream.state === STREAMSTATE.STREAMSTATE_STOPPED
    const can_stop = !needs_reset && stream.state !== STREAMSTATE.STREAMSTATE_IDLE
    const can_pause = stream.state === STREAMSTATE.STREAMSTATE_ACTIVE

    function send_command(v) {
        stream.setState(v.target.value)
        if (
            stream.state === STREAMSTATE.STREAMSTATE_IDLE &&
            v.target.value === STREAMCOMMAND.STREAMCOMMAND_RUN
        ) {
            console.log("send gcode")
            send_gcode()
        }
    }

    // console.log("GCODE", gcode)

    return (
        <Tile
            title="GCode Sender"
            settings={<GCodeSettings />}
            controls={
                <>
                    <Space>
                        <Select
                            size="small"
                            value={workOffset}
                            onChange={v => frames.setActiveFrame(v)}
                        >
                            <Option value={0}>G54</Option>
                            <Option value={1}>G55</Option>
                            <Option value={2}>G56</Option>
                            <Option value={3}>G57</Option>
                            <Option value={4}>G58</Option>
                        </Select>
                        <span>{(stream.time / 1000).toFixed(1)}s</span>
                        <Tag>{STREAMSTATE[stream.state]}</Tag>

                        <Radio.Group
                            optionType="button"
                            onChange={send_command}
                            value={inferredCommand}
                        >
                            <Radio.Button
                                disabled={can_pause}
                                value={STREAMCOMMAND.STREAMCOMMAND_RUN}
                            >
                                {needs_reset ? <ReloadOutlined /> : <CaretRightOutlined />}
                            </Radio.Button>
                            <Radio.Button
                                disabled={!can_pause}
                                value={STREAMCOMMAND.STREAMCOMMAND_PAUSE}
                            >
                                <PauseOutlined />
                            </Radio.Button>
                            <Radio.Button
                                disabled={!can_stop}
                                value={STREAMCOMMAND.STREAMCOMMAND_STOP}
                            >
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    markers={highlight}
                />
            </StyledDiv>
        </Tile>
    )
}
