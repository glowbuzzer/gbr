/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Card, TabsProps } from "antd"
import { GbemConfigTab } from "./GbemConfigTab"
import { GbemReadSlaveTab } from "./gbemReadSlaves/GbemReadSlaveTab"
import { GbemOptionalSlavesTab } from "./GbemOptionalSlavesTab"
import { SlaveCatProvider } from "./slaveCatData/slaveCatProvider"
import { IoConfigTab } from "./ioConfig/IoConfigTab"

const StyledDiv = styled.div`
    padding: 10px;
    height: 100%;

    .ant-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        .ant-card-body {
            flex-grow: 1;
        }
    }
`

export const ConfigEditTile2 = () => {
    const [currentTab, setCurrentTab] = useState("config")

    const tab_content = {
        config: <GbemConfigTab />,
        readSlaves: <GbemReadSlaveTab />,
        optionalSlaves: <GbemOptionalSlavesTab />,
        io: <IoConfigTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "config", label: "Config" },
        { key: "readSlaves", label: "Read slave config" },
        { key: "optionalSlaves", label: "Optional slave enable" },
        { key: "io", label: "IO configuration" },
        { key: "setSlaveConfig", label: "Set slave config" },
        { key: "toolConfig", label: "Tool configuration" },
        { key: "machineEnvelope", label: "Set machine envelope" },
        { key: "frames", label: "Frames config" },
        { key: "verticalAxis", label: "Vertical axis config" },
        { key: "debug", label: "Debug setings" }
    ]

    function switch_tab(e: string) {
        setCurrentTab(e)
    }

    return (
        <SlaveCatProvider>
            <StyledDiv>
                <Card
                    tabList={tabs}
                    size="small"
                    activeTabKey={currentTab}
                    onTabChange={switch_tab}
                >
                    {tab_content[currentTab]}
                </Card>
            </StyledDiv>
        </SlaveCatProvider>
    )
}
