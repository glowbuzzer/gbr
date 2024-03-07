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

export const FlowActivityParams = ({ item }: { item: ActivityStreamItem }) => {
    const { dout, aout, iout, uiout, externalIout, externalUiout, externalDout, safetyDout } =
        useConfig()

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
                    name={dout[item.setDout.doutToSet].name}
                    value={to_digital_out_string(item.setDout.valueToSet)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT:
            return (
                <FlowActivityParamsGeneric
                    name={externalDout[item.setExternalDout.doutToSet].name}
                    value={to_digital_out_string(item.setExternalDout.valueToSet)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={iout[item.setIout.ioutToSet].name}
                    value={item.setIout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT:
            return (
                <FlowActivityParamsGeneric
                    name={externalIout[item.setExternalIout.ioutToSet].name}
                    value={item.setExternalIout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT:
            return (
                <FlowActivityParamsGeneric
                    name={aout[item.setAout.aoutToSet].name}
                    value={item.setAout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={uiout[item.setUiout.ioutToSet].name}
                    value={item.setUiout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT:
            return (
                <FlowActivityParamsGeneric
                    name={externalUiout[item.setExternalUiout.ioutToSet].name}
                    value={item.setExternalUiout.valueToSet.toString()}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_DWELL:
            return (
                <StyledFlowSettingItem>
                    <div>{item.dwell.msToDwell}</div>
                    <div>MS</div>
                </StyledFlowSettingItem>
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SPINDLE:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSINTERPOLATED:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINPOS:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINVELO:
        case ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEROTATIONATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEINSTANT:
            return <FlowActivityParamsNotSupported />
    }
}
