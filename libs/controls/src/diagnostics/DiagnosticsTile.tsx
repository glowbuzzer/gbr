/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { Card, TabsProps } from "antd"
import { EmStatTab } from "./EmStatTab"
import { SafetyTab } from "./SafetyTab"

const StyledDiv = styled.div`
    padding: 10px;
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
        safety: <SafetyTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "etherCat", label: "EtherCAT diagnostics" },
        {
            key: "safety",
            label: "Safety diagnostics"
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