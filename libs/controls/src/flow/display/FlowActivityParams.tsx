/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { ActivityStreamItem, ACTIVITYTYPE, useConfig } from "@glowbuzzer/store"
import { StyledFlowSettingItem } from "../styles"
import { FlowActivityParamsNotSupported } from "./FlowActivityParamsNotSupported"
import { FlowActivityCartesianPosition } from "./FlowActivityCartesianPosition"
import { FlowActivityParamsGeneric } from "./FlowActivityParamsGeneric"

function to_digital_out_string(value: boolean) {
    return value ? "ON" : "OFF"
}

function to_digital_out_strings(value: boolean[]) {
    return value.map(v => (v ? "ON" : "OFF")).join(", ")
}

export const FlowActivityParams = ({ item }: { item: ActivityStreamItem }) => {
    const {
        dout,
        aout,
        iout,
        uiout,
        externalIout,
        externalUiout,
        externalDout,
        safetyDout,
        modbusDout,
        modbusUiout,
        tool
    } = useConfig()

    function safe_name(arr, index) {
        return `${arr[index]?.name || "Unknown"} (${index})`
    }

    switch (item.activityType) {
        case ACTIVITYTYPE.ACTIVITYTYPE_NONE:
        case ACTIVITYTYPE.ACTIVITYTYPE_PAUSEPROGRAM:
        case ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM:
            return null
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            return <FlowActivityCartesianPosition position={item.moveLine.line} />
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            return (
                <FlowActivityCartesianPosition
                    position={item.moveToPosition.cartesianPosition.position}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(dout, item.setDout.doutToSet)}
                    value={to_digital_out_string(item.setDout.valueToSet)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(externalDout, item.setExternalDout.doutToSet)}
                    value={to_digital_out_string(item.setExternalDout.valueToSet)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(iout, item.setIout.ioutToSet)}
                    value={item.setIout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(externalIout, item.setExternalIout.ioutToSet)}
                    value={item.setExternalIout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(aout, item.setAout.aoutToSet)}
                    value={item.setAout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(uiout, item.setUiout.ioutToSet)}
                    value={item.setUiout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(externalUiout, item.setExternalUiout.ioutToSet)}
                    value={item.setExternalUiout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSDOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(modbusDout, item.setModbusDout.doutToSet)}
                    value={to_digital_out_strings(item.setModbusDout.valueToSetArray)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSUIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={safe_name(modbusUiout, item.setModbusUiout.uioutToSet)}
                    value={item.setModbusUiout.valueToSetArray.join(", ")}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_DWELL:
            return (
                <StyledFlowSettingItem>
                    <div>{item.dwell.msToDwell}</div>
                    <div>MS</div>
                </StyledFlowSettingItem>
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET:
            return (
                <StyledFlowSettingItem>
                    <div>{safe_name(tool, item.setToolOffset.toolIndex)}</div>
                </StyledFlowSettingItem>
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_PAYLOAD:
            return (
                <StyledFlowSettingItem>
                    <div>{item.setPayload.mass}</div>
                </StyledFlowSettingItem>
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SPINDLE:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSINTERPOLATED:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINPOS:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINVELO:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEROTATIONATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEINSTANT:
            return <FlowActivityParamsNotSupported />
    }
}
