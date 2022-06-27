/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useRef } from "react"
import AceEditor from "react-ace"

const AceEditorFixed = (AceEditor as any).default ? (AceEditor as any).default : AceEditor

import "ace-builds/src-noconflict/theme-github.js"
import "ace-builds/src-noconflict/mode-gcode.js"
import "ace-builds/src-noconflict/mode-text.js"

import { Tile } from "../tiles"
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

/**
 * The G-code tile provides an editor for G-code and the ability to stream programs to GBC.
 *
 * Changes you make to the G-code will be reflected by the preview in the {@link ToolPathTile}.
 *
 * You can execute, pause, resume and cancel jobs using the controls in the title bar of the tile.
 *
 * As G-code executes the currently executing activity is highlighted in the editor.
 *
 * The work offset drop down allows you to specify the default work offset at the start of the program.
 * If your G-code specifies work offsets within it, these will override this setting.
 *
 * Note that the work offsets G54 and so on correspond to frames in your configuration, starting
 * at frame zero.
 *
 */
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
    const position = useKinematicsCartesianPosition(0).position
    const editorRef = useRef<AceEditor>(null)
    const timerRef = useRef<any>()

    // we need to pass linear vmax to gcode interpreter to support F code calcs
    const vmax = Object.values(config.kinematicsConfiguration)[0]?.linearLimits?.[0].vmax

    const stream_state = stream.state
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            if (stream_state === STREAMSTATE.STREAMSTATE_IDLE) {
                // we should only update the preview if stream is idle (otherwise whole preview moves while running)
                preview.setGCode("G" + (54 + workOffset) + "\n" + gcode)
            }
        }, 500)
        return () => clearTimeout(timerRef.current)
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
        preview.setHighlightLine(e.cursor.row + 1)
    }

    const highlight = active
        ? [
              {
                  startRow: stream.lineNum - 1,
                  endRow: stream.lineNum,
                  startCol: 0,
                  endCol: 0,
                  type: "screenLine",
                  className: "gb-ace-highlight"
              }
          ]
        : []

    useEffect(() => {
        if (active) {
            editorRef.current.editor.scrollToLine(stream.lineNum - 1, true, true, () => {})
        }
    }, [active, stream.lineNum])

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
        switch (v.target.value as STREAMCOMMAND) {
            case STREAMCOMMAND.STREAMCOMMAND_RUN:
                if (stream.state === STREAMSTATE.STREAMSTATE_IDLE) {
                    console.log("reset and send gcode")
                    stream.reset()
                    send_gcode()
                }
                break
            case STREAMCOMMAND.STREAMCOMMAND_PAUSE:
                break
            case STREAMCOMMAND.STREAMCOMMAND_STOP:
                stream.reset()
                break
        }
    }

    return (
        <Tile
            title="GCode"
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
                <AceEditorFixed
                    ref={editorRef}
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
