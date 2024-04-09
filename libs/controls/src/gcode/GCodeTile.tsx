/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useRef } from "react"
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/theme-github.js"
import "ace-builds/src-noconflict/theme-gruvbox.js"
import "ace-builds/src-noconflict/mode-gcode.js"
import "ace-builds/src-noconflict/mode-text.js"

import { Radio, Space, Tag } from "antd"
import {
    GCodeMode,
    settings,
    STREAMCOMMAND,
    STREAMSTATE,
    useConfig,
    useConnection,
    useFrames,
    useGCode,
    useStream,
    useGCodeContext,
    useKinematicsCartesianPosition,
    useKinematicsOffset,
    usePrefs,
    usePreview,
    useActiveFrame,
    useFramesList
} from "@glowbuzzer/store"
import styled, { css } from "styled-components"
import { CaretRightOutlined, PauseOutlined, ReloadOutlined } from "@ant-design/icons"
import { StopIcon } from "../util/StopIcon"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { GCodeWorkOffsetSelect } from "./GCodeWorkOffsetSelect"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { useGlowbuzzerTheme } from "../app/GlowbuzzerThemeProvider"

const AceEditorFixed = (AceEditor as any).default ? (AceEditor as any).default : AceEditor

const { load, save } = settings<string>("tiles.gcode")

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
 * Changes you make to the G-code will be reflected by the preview in the {@link ThreeDimensionalSceneTile}.
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
export const GCodeTile = ({ kinematicsConfigurationIndex = 0 }) => {
    const [gcode, setGCode] = React.useState(load("G1 X10 Y5 Z2"))

    const connection = useConnection()
    const stream = useStream(kinematicsConfigurationIndex)
    const send = useGCode(kinematicsConfigurationIndex)
    const prefs = usePrefs()
    const preview = usePreview()
    const active = stream.state !== STREAMSTATE.STREAMSTATE_IDLE
    const [workOffset] = useActiveFrame()
    const config = useConfig()
    const [offset] = useKinematicsOffset(0)
    const position = useKinematicsCartesianPosition(0).position
    const gCodeContext = useGCodeContext()
    const framesList = useFramesList()
    const { darkMode } = useGlowbuzzerTheme()

    const usingWorkOffsets = framesList.some(frame => frame.workspaceOffset)

    const mode = gCodeContext?.mode || GCodeMode.CARTESIAN

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
        config /* extra dep because config can cause frames to change */
    ])

    function send_gcode() {
        save(gcode)
        const offset = "G" + (54 + workOffset)
        send(offset + "\n" + gcode + (prefs.current.send_m2 ? " M2" : ""), vmax)
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
                  startRow: stream.tag - 1,
                  endRow: stream.tag,
                  startCol: 0,
                  endCol: 0,
                  type: "screenLine",
                  className: "gb-ace-highlight"
              }
          ]
        : []

    useEffect(() => {
        if (active) {
            editorRef.current.editor.scrollToLine(stream.tag - 1, true, true, () => {})
        }
    }, [active, stream.tag])

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

    const current_line = stream.state === STREAMSTATE.STREAMSTATE_IDLE ? 0 : stream.tag

    function send_command(v) {
        stream.sendCommand(v.target.value)
        switch (v.target.value as STREAMCOMMAND) {
            case STREAMCOMMAND.STREAMCOMMAND_RUN:
                if (stream.state === STREAMSTATE.STREAMSTATE_IDLE) {
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
        <DockTileWithToolbar
            toolbar={
                <>
                    {usingWorkOffsets && (
                        <DockToolbarButtonGroup>
                            <GCodeWorkOffsetSelect />
                        </DockToolbarButtonGroup>
                    )}
                    <DockToolbarButtonGroup>
                        <Radio.Group
                            size={"small"}
                            optionType="button"
                            onChange={send_command}
                            value={inferredCommand}
                        >
                            <Radio.Button
                                disabled={can_pause || !connection.connected}
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
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        <Tag>
                            {connection.connected
                                ? STREAMSTATE[stream.state].substring(12)
                                : "OFFLINE"}
                        </Tag>
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        Line {current_line} of {gcode.split("\n").length}
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        Running Time <span>{(stream.time / 1000).toFixed(1)}s</span>
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>Queued {stream.queued}</DockToolbarButtonGroup>
                    {mode === GCodeMode.JOINT && (
                        <DockToolbarButtonGroup>
                            <Tag>JOINT MODE</Tag>
                        </DockToolbarButtonGroup>
                    )}
                </>
            }
        >
            <StyledDiv readOnly={active}>
                <AceEditorFixed
                    ref={editorRef}
                    readOnly={active}
                    mode="gcode"
                    theme={darkMode ? "gruvbox" : "github"}
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
        </DockTileWithToolbar>
    )
}
