import React from "react"

import styled from "styled-components"

import "antd/dist/antd.css"
import "react-grid-layout/css/styles.css"
import "./app.css"
import { Menu } from "antd"
import { Tile, TileConfiguration, TileLayout, TileProvider, useTiles } from "@glowbuzzer/layout"
import { ConnectTile, GCodeTile } from "@glowbuzzer/controls"
import { TelemetryTile } from "@glowbuzzer/controls"
import { DrivesTile } from "./tiles/DrivesTile"
import { DevToolsTile } from "@glowbuzzer/controls"
import { ToolPathTile } from "@glowbuzzer/controls"
import { SimpleDroTile } from "./tiles/SimpleDroTile"
import { SparklineDynamic } from "@glowbuzzer/controls"

const StyledApp = styled.div``

const AppInner = () => {
    const { tiles, setVisible } = useTiles()

    return (
        <StyledApp>
            <Menu mode="horizontal">
                <Menu.Item>File</Menu.Item>
                <Menu.SubMenu title="View">
                    {tiles.map(tile => (
                        <Menu.Item key={tile.id} onClick={() => setVisible(tile.id, !tile.visible)}>
                            {tile.visible && <span>x</span>} {tile.title}
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu>
            <TileLayout />
        </StyledApp>
    )
}

export const App = () => {
    const tiles: TileConfiguration = {
        connection: {
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            title: "Connection",
            render: <ConnectTile />
        },
        simpledro: {
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            title: "Digital Readout",
            render: tile => <SimpleDroTile />
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
            x: 0,
            y: 0,
            width: 2,
            height: 2,
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
