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
import { SmStatTab } from "./SmStatTab"

const StyledDiv = styled.div`
    height: 100%;

    .ant-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        .ant-card-body {
            flex-grow: 1;
            overflow-y: auto;
            padding: 1px 0;
        }
    }
`

/**
 * Provides a set of diagnostic tools for the machine, including EtherCAT diagnostics, drive diagnostics, safety diagnostics, and slave file operations.
 */
export const DiagnosticsTileStepMaster = () => {
    const [currentTab, setCurrentTab] = useState("stepMaster")

    const tab_content = {
        stepMaster: <SmStatTab />
        // drives: <DrivesTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "stepMaster", label: "Step Master Diagnostics" }
        // { key: "drives", label: "Drives Diagnostics" }
    ]

    function switch_tab(e: string) {
        setCurrentTab(e)
    }

    return (
        <StyledDiv>
            <Card
                bordered={false}
                tabList={tabs}
                size="small"
                activeTabKey={currentTab}
                onTabChange={switch_tab}
            >
                {tab_content[currentTab]}
            </Card>
        </StyledDiv>
    )
}
