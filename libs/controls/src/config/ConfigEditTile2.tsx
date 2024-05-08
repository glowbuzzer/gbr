/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { Card, TabsProps } from "antd"
import { useState } from "react"
import { GbemConfigTab } from "./GbemConfigTab"
import { GbemRequestTab } from "./GbemRequestTab"

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
        request: <GbemRequestTab />
    }

    const tabs: TabsProps["items"] = [
        { key: "config", label: "Config" },
        { key: "request", label: "Request" }
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
