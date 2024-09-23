/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Card, Flex } from "antd"
import styled from "styled-components"
import { useState } from "react"
import { SlaveCatProvider } from "./slaveCatData/slaveCatProvider"
import { EtherCatSlaveConfigTab } from "./etherCatSlaveConfigTab/EtherCatSlaveConfigTab"
import { EtherCatReadSlaveTab } from "./etherCatReadSlaveTab/EtherCatReadSlaveTab"
import { EtherCatConfigProvider, useEtherCatConfig } from "./EtherCatConfigContext"
import { EtherCatOptionalSlavesTab } from "./etherCatOptionalSlavesTab/EtherCatOptionalSlavesTab"
import { EtherCatWriteSlaveTab } from "./etherCatWriteSlaveTab/EtherCatWriteSlaveTab"
import { CardMaximised } from "../util/CardMaximised"

const StyledFlex = styled(Flex)`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    //justify-content: space-between;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }
`

const contentList: Record<string, (props: {}) => React.ReactNode> = {
    editConfig: props => <EtherCatSlaveConfigTab {...props} />,
    readSdo: props => <EtherCatReadSlaveTab {...props} />,
    // writeSdo: () => <EtherCatWriteSlaveTab />,
    optionalSlaves: () => <EtherCatOptionalSlavesTab />
}

/**
 * A component to configure EtherCAT slaves.
 */
export const EtherCatConfigTab = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>("editConfig")

    const { initialTabList, disabledTabs, enableAll, disableAll } = useEtherCatConfig()

    const onTabChange = (key: string) => {
        if (!disabledTabs.includes(key)) {
            setActiveTabKey(key)
        }
    }

    // Create a new tabList with disabled state
    const tabList = initialTabList.map(tab => ({
        ...tab,
        disabled: disabledTabs.includes(tab.key)
    }))

    const ActiveContent = contentList[activeTabKey]

    return (
        <SlaveCatProvider>
            <StyledFlex>
                <CardMaximised
                    bordered={false}
                    style={{ width: "100%" }}
                    tabList={tabList}
                    activeTabKey={activeTabKey}
                    onTabChange={onTabChange}
                    size="small"
                >
                    {ActiveContent({ enableAll, disableAll })}
                </CardMaximised>
            </StyledFlex>
        </SlaveCatProvider>
    )
}
