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

const StyledDiv = styled.div`
    //padding: 10px;
    //height: 100%;

    .ant-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        .ant-card-body {
            flex-grow: 1;
        }
    }
`

/**
 * A component to edit the configuration of the machine.
 */
export const ConfigEditTile = () => {
    const [currentTab, setCurrentTab] = useState("etherCat")

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
        { key: "io", label: "IO config" },
        { key: "etherCat", label: "EtherCAT config" },
        { key: "drives", label: "Drives config" },
        { key: "tool", label: "Tools config" },
        { key: "machineEnvelope", label: "Machine envelope config" },
        { key: "frames", label: "Frames config" },
        { key: "verticalAxis", label: "Vertical axis config" },
        { key: "debug", label: "Debug config" },
        { key: "version", label: "Software versions" }
    ]

    function switch_tab(e: string) {
        setCurrentTab(e)
    }

    return (
        <StyledDiv>
            <EtherCatConfigProvider>
                <Card
                    bordered={false}
                    tabList={tabs}
                    size="small"
                    activeTabKey={currentTab}
                    onTabChange={switch_tab}
                >
                    {tab_content[currentTab]}
                </Card>
            </EtherCatConfigProvider>
        </StyledDiv>
    )
}
