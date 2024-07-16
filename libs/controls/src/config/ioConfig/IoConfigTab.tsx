/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { Card } from "antd"

import { StandardDigitalInputs } from "./StandardDigitalInputs"
import { StandardDigitalOutputs } from "./StandardDigitalOutputs"
import { ModbusDigitalInputs } from "./ModbusDigitalInputs"
import { StandardIntegerInputs } from "./StandardIntegerInputs"
import { StandardUnsidedIntegerInputs } from "./StandardUnsignedIntegerInputs"
import { StandardIntegerOutputs } from "./StandardIntegerOuputs"
import { StandardUnsignedIntegerOuputs } from "./StandardUnsignedIntegerOuputs"
import { ModbusDigitalOutputs } from "./ModbusDigitalOutputs"
import { SafetyDigitalInputs } from "./SafetyDigitalInputs"
import { SafetyDigitalOutputs } from "./SafetyDigitalOutputs"
import { ModbusIntegerInputs } from "./ModbusIntegerInputs"
import { ModbusIntegerOutputs } from "./ModbusIntegerOutputs"

const tabList = [
    {
        key: "standardDigitalInputs",
        tab: "Standard Digital Inputs"
    },
    {
        key: "modbusDigitalInputs",
        tab: "Modbus Digital Inputs"
    },
    {
        key: "standardDigitalOutputs",
        tab: "Standard Digital Outputs"
    },
    {
        key: "modbusDigitalOutputs",
        tab: "Modbus Digital Outputs"
    },
    {
        key: "standardIntegerInputs",
        tab: "Standard Integer Inputs"
    },
    {
        key: "standardUnsignedIntegerInputs",
        tab: "Standard Unsigned Integer Inputs"
    },
    {
        key: "modbusIntegerInputs",
        tab: "Modbus Integer Inputs"
    },
    {
        key: "standardIntegerOutputs",
        tab: "Standard Integer Outputs"
    },
    {
        key: "standardUnsignedIntegerOutputs",
        tab: "Standard Unsigned Integer Outputs"
    },
    {
        key: "modbusIntegerOutputs",
        tab: "Modbus Integer Outputs"
    },
    {
        key: "safetyDigitalInputs",
        tab: "Safety Digital Inputs"
    },
    {
        key: "safetyDigitalOutputs",
        tab: "Safety Digital Outputs"
    }
]

const contentList: Record<string, React.ReactNode> = {
    standardDigitalInputs: <StandardDigitalInputs />,
    modbusDigitalInputs: <ModbusDigitalInputs />,
    standardDigitalOutputs: <StandardDigitalOutputs />,
    modbusDigitalOutputs: <ModbusDigitalOutputs />,
    standardIntegerInputs: <StandardIntegerInputs />,
    standardUnsignedIntegerInputs: <StandardUnsidedIntegerInputs />,
    modbusIntegerInputs: <ModbusIntegerInputs />,
    standardIntegerOutputs: <StandardIntegerOutputs />,
    standardUnsignedIntegerOutputs: <StandardUnsignedIntegerOuputs />,
    modbusIntegerOutputs: <ModbusIntegerOutputs />,
    safetyDigitalInputs: <SafetyDigitalInputs />,
    safetyDigitalOutputs: <SafetyDigitalOutputs />
}

const IoCards: React.FC = () => {
    const [activeTabKey, setActiveTabKey] = useState<string>("standardDigitalInputs")

    const onTabChange = (key: string) => {
        setActiveTabKey(key)
    }

    return (
        <Card
            style={{ width: "100%" }}
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
            size="small"
        >
            {contentList[activeTabKey]}
        </Card>
    )
}

/**
 * The IO config tab shows the cards for the different typesof IO
 * @constructor
 */
export const IoConfigTab = () => {
    return <IoCards />
}
