import React from "react"

import styled from "styled-components"

import "antd/dist/antd.css"
import "react-grid-layout/css/styles.css"
import "./app.css"
import { Menu } from "antd"
import { TileConfiguration, TileLayout, TileProvider, useTiles } from "@glowbuzzer/layout"
import { ConnectTile, DevToolsTile, GCodeTile, TelemetryTile, ToolPathTile } from "@glowbuzzer/controls"
import { DrivesTile } from "./tiles/DrivesTile"
import { SimpleDroTile } from "./tiles/SimpleDroTile"

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

// const TestTile = () => {
//     return (
//         <Tile
//             title={<div>This is tile title</div>}
//             footer={<div>This is tile footer</div>}
//             settings={
//                 <TileSettings>
//                     <div>These are tile settings</div>
//                 </TileSettings>
//             }
//         >
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//             <p>This is tile content</p>
//         </Tile>
//     )
// }

export const App = () => {
    const tiles: TileConfiguration = {
        // test: {
        //     x: 0,
        //     y: 0,
        //     width: 3,
        //     height: 2,
        //     title: "Test",
        //     render: <TestTile />
        // }
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
