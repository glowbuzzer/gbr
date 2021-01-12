import React, { useState } from "react"

import { Menu } from "antd"
import { TileConfiguration, TileLayout, TileProvider, useTiles } from "@glowbuzzer/layout"
import {
    AnalogInputsTile,
    AnalogOutputsTile,
    ConnectTile,
    DevToolsTile,
    DigitalInputsTile,
    DigitalOutputsTile,
    FeedRateTile,
    GCodeTile,
    IntegerInputsTile,
    IntegerOutputsTile,
    JogTile,
    PreferencesDialog,
    TelemetryTile,
    ToolPathTile
} from "@glowbuzzer/controls"
import { DrivesTile } from "./tiles/DrivesTile"
import { SimpleDroTile } from "./tiles/SimpleDroTile"
import { TestTile } from "./tiles/TestTile"
import styled from "styled-components"

import "antd/dist/antd.css"
import "react-grid-layout/css/styles.css"
import "./app.css"
import { CheckOutlined } from "@ant-design/icons"

const StyledApp = styled.div``

const AppInner = () => {
    const { tiles, setVisible } = useTiles()
    const [showPreferences, setShowPreferences] = useState(false)

    function handleClick(e) {
        switch (e.key) {
            case "file:prefs":
                setShowPreferences(true)
                break
        }
    }

    function tile_items(selected: string[]) {
        const selected_tiles = tiles.filter(t => selected.includes(t.id))
        return selected_tiles.map(tile => {
            return (
                <Menu.Item key={tile.id} onClick={() => setVisible(tile.id, !tile.visible)}>
                    {tile.visible && (
                        <span>
                            <CheckOutlined />
                        </span>
                    )}{" "}
                    {tile.title}
                </Menu.Item>
            )
        })
    }

    return (
        <StyledApp>
            <PreferencesDialog visible={showPreferences} onClose={() => setShowPreferences(false)} />
            <Menu mode="horizontal" onClick={handleClick}>
                <Menu.SubMenu title="File">
                    <Menu.Item key="file:prefs">Preferences...</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu title="View">
                    {tile_items(["connection", "gcode", "toolpath", "feedrate", "jogging"])}
                    <Menu.SubMenu title="Input/Output" children={tile_items(["dins", "douts", "ains", "aouts", "iins", "iouts"])} />
                    <Menu.SubMenu title="Advanced" children={tile_items(["drives", "telemetry", "devtools"])} />
                </Menu.SubMenu>
            </Menu>
            <TileLayout />
        </StyledApp>
    )
}

export const App = () => {
    const tiles: TileConfiguration = {
        test: {
            x: 2,
            y: 0,
            width: 4,
            height: 4,
            title: "Test",
            render: <TestTile />
        },
        connection: {
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            title: "Connection",
            render: <ConnectTile />
        },
        feedrate: {
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            title: "Feedrate",
            render: <FeedRateTile />
        },
        jogging: {
            x: 0,
            y: 0,
            width: 2,
            height: 4,
            title: "Jogging",
            render: <JogTile />
        },
        simpledro: {
            x: 6,
            y: 0,
            width: 2,
            height: 2,
            title: "Digital Readout",
            render: tile => <SimpleDroTile />
        },
        dins: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Digital Inputs",
            render: <DigitalInputsTile labels={["BLINKY"]} />
        },
        douts: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Digital Outputs",
            render: <DigitalOutputsTile labels={["DOUT1"]} />
        },
        ains: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Analog Inputs",
            render: <AnalogInputsTile labels={["AIN1"]} />
        },
        aouts: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Analog Outputs",
            render: <AnalogOutputsTile labels={["AOUT1"]} />
        },
        iins: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Integer Inputs",
            render: <IntegerInputsTile labels={["IIN1"]} />
        },
        iouts: {
            x: 6,
            y: 0,
            width: 1,
            height: 6,
            title: "Integer Outputs",
            render: <IntegerOutputsTile labels={["IOUT1"]} />
        },
        gcode: {
            x: 0,
            y: 0,
            width: 2,
            height: 5,
            title: "GCode",
            render: tile => <GCodeTile />
        },
        devtools: {
            x: 6,
            y: 0,
            width: 2,
            height: 4,
            title: "Developer Tools",
            render: <DevToolsTile />
        },
        drives: {
            x: 2,
            y: 0,
            width: 4,
            height: 8,
            title: "Drives",
            render: tile => <DrivesTile />
        },
        toolpath: {
            x: 2,
            y: 0,
            width: 4,
            height: 11,
            title: "Tool Path",
            render: tile => <ToolPathTile />
        },
        telemetry: {
            x: 2,
            y: 0,
            width: 4,
            height: 6,
            title: "Telemetry",
            render: tile => <TelemetryTile />
        }
    }

    if (window.location.search === "?debug") {
        return <TelemetryTile />
    }

    return (
        <TileProvider tiles={tiles}>
            <AppInner />
        </TileProvider>
    )
}

export default App
