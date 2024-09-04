/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Card, TabsProps } from "antd"
import { EmStatTab } from "./EmStatTab"
import { SafetyTab } from "./SafetyTab"
import { DrivesTab } from "./DrivesTab"
import { SlaveFileOpsTab } from "./SlaveFileOpsTab"

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

export const DiagnosticsTile = () => {
    const [currentTab, setCurrentTab] = useState("etherCat")

    const tab_content = {
        etherCat: <EmStatTab />,
        drives: <DrivesTab />,
        safety: <SafetyTab />,
        files: <SlaveFileOpsTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "etherCat", label: "EtherCAT diagnostics" },
        { key: "drives", label: "Drives diagnostics" },
        {
            key: "safety",
            label: "Safety diagnostics"
        },
        {
            key: "files",
            label: "Slave file operations"
        }
    ]

    function switch_tab(e: string) {
        setCurrentTab(e)
    }

    return (
        <StyledDiv>
            <Card tabList={tabs} size="small" activeTabKey={currentTab} onTabChange={switch_tab}>
                {tab_content[currentTab]}
            </Card>
        </StyledDiv>
    )
}
