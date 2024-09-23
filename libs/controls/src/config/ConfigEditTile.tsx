/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Card, TabsProps } from "antd"
import { EtherCatConfigTab } from "./etherCatConfigTab/EtherCatConfigTab"
import { IoConfigTab } from "./ioConfig/IoConfigTab"
import { VersionTab } from "./versionTab/VersionTab"
import { EtherCatConfigProvider } from "./etherCatConfigTab/EtherCatConfigContext"
import { MachineEnvelopeConfigTab } from "./machineEnvelopeConfigTab/MachineEnvelopeConfigTab"
import { VerticalAxisConfigTab } from "./verticalAxisConfigTab/verticalAxisConfigTab"
import { ToolConfigTab } from "./toolConfigTab/ToolConfigTab"
import { DrivesTab } from "../diagnostics/DrivesTab"
import { DriveConfigTab } from "./driveConfigTab/driveConfigTab"
import { FramesConfigTab } from "./framesConfigTab/FramesConfigTab"
import { CardMaximised } from "./util/CardMaximised"

const StyledDiv = styled.div`
    height: 100%;

    .ant-card {
    }
`

/**
 * A component to edit the configuration of the machine.
 */
export const ConfigEditTile = () => {
    const [currentTab, setCurrentTab] = useState("io")

    const tab_content = {
        io: <IoConfigTab />,
        etherCat: <EtherCatConfigTab />,
        drives: <DriveConfigTab />,
        tool: <ToolConfigTab />,
        machineEnvelope: <MachineEnvelopeConfigTab />,
        frames: <FramesConfigTab />,
        verticalAxis: <VerticalAxisConfigTab />,
        debug: <p>Debug config content</p>,
        version: <VersionTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "io", label: "IO Config" },
        { key: "etherCat", label: "EtherCAT Config" },
        { key: "drives", label: "Drives Config" },
        { key: "tool", label: "Tools Config" },
        { key: "machineEnvelope", label: "Machine Envelope Config" },
        { key: "frames", label: "Frames Config" },
        { key: "verticalAxis", label: "Vertical Axis Config" },
        { key: "debug", label: "Debug Config" },
        { key: "version", label: "Software Versions" }
    ]

    function switch_tab(e: string) {
        setCurrentTab(e)
    }

    return (
        <StyledDiv data-x="$$$ConfigEditTile">
            <EtherCatConfigProvider>
                <CardMaximised
                    bordered={false}
                    tabList={tabs}
                    size="small"
                    activeTabKey={currentTab}
                    onTabChange={switch_tab}
                >
                    {tab_content[currentTab]}
                </CardMaximised>
            </EtherCatConfigProvider>
        </StyledDiv>
    )
}
