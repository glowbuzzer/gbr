/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useEffect, useState } from "react"
import { Modal } from "antd"
import { ActivityStreamItem, ACTIVITYTYPE, useConfig } from "@glowbuzzer/store"
import { FlowEditorMoveToPositionTabs } from "./FlowEditorMoveToPositionTabs"
import { FlowEditorMoveLineTabs } from "./FlowEditorMoveLineTabs"
import { FlowEditorSetDigitalOutputTabs } from "./FlowEditorSetDigitalOutputTabs"
import { FlowEditorSetGenericNumericOutputTabs } from "./FlowEditorSetGenericNumericOutputTabs"
import { FlowEditorDwellTabs } from "./FlowEditorDwellTabs"
import { FlowEditorSetPayloadTabs } from "./FlowEditorSetPayloadTabs"
import { FlowEditorSetToolOffsetTabs } from "./FlowEditorSetToolOffsetTabs"
import { FlowEditorSetModbusDout } from "./FlowEditorSetModbusDout"
import { FlowEditorSetModbusUiout } from "./FlowEditorSetModbusUiout"

function clone(item: ActivityStreamItem): ActivityStreamItem {
    return item ? JSON.parse(JSON.stringify(item)) : item
}

type FlowEditContextType = {
    item: ActivityStreamItem
    onChange(item: ActivityStreamItem): void
}

const flowEditContext = createContext<FlowEditContextType>(null)

export const useFlowEdit = () => {
    return React.useContext(flowEditContext)
}

const FlowEditor = () => {
    const { item, onChange } = useFlowEdit()
    const { dout, externalDout, aout, iout, uiout, externalIout, externalUiout } = useConfig()

    switch (item.activityType) {
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            return <FlowEditorMoveToPositionTabs />
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            return <FlowEditorMoveLineTabs />
        case ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT:
            return (
                <FlowEditorSetDigitalOutputTabs
                    value={item.setDout}
                    onChangeValue={value => onChange({ ...item, setDout: value })}
                    options={dout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT:
            return (
                <FlowEditorSetDigitalOutputTabs
                    value={item.setExternalDout}
                    onChangeValue={value => onChange({ ...item, setExternalDout: value })}
                    options={externalDout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT:
            return (
                <FlowEditorSetGenericNumericOutputTabs
                    index={item.setAout.aoutToSet}
                    value={item.setAout.valueToSet}
                    precision={3}
                    onChange={(index: number, value: number) =>
                        onChange({ ...item, setAout: { aoutToSet: index, valueToSet: value } })
                    }
                    options={aout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT:
            return (
                <FlowEditorSetGenericNumericOutputTabs
                    index={item.setIout.ioutToSet}
                    value={item.setIout.valueToSet}
                    precision={0}
                    onChange={(index: number, value: number) =>
                        onChange({ ...item, setIout: { ioutToSet: index, valueToSet: value } })
                    }
                    options={iout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT:
            return (
                <FlowEditorSetGenericNumericOutputTabs
                    index={item.setUiout.ioutToSet}
                    value={item.setUiout.valueToSet}
                    precision={0}
                    onChange={(index: number, value: number) =>
                        onChange({ ...item, setUiout: { ioutToSet: index, valueToSet: value } })
                    }
                    options={uiout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT:
            return (
                <FlowEditorSetGenericNumericOutputTabs
                    index={item.setExternalIout.ioutToSet}
                    value={item.setExternalIout.valueToSet}
                    precision={0}
                    onChange={(index: number, value: number) =>
                        onChange({
                            ...item,
                            setExternalIout: { ioutToSet: index, valueToSet: value }
                        })
                    }
                    options={externalIout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT:
            return (
                <FlowEditorSetGenericNumericOutputTabs
                    index={item.setExternalUiout.ioutToSet}
                    value={item.setExternalUiout.valueToSet}
                    precision={0}
                    onChange={(index: number, value: number) =>
                        onChange({
                            ...item,
                            setExternalUiout: { ioutToSet: index, valueToSet: value }
                        })
                    }
                    options={externalUiout.map(v => v.name)}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_DWELL:
            return (
                <FlowEditorDwellTabs
                    value={item.dwell}
                    onChangeValue={value => onChange({ ...item, dwell: value })}
                />
            )
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_PAYLOAD:
            return <FlowEditorSetPayloadTabs />

        case ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET:
            return <FlowEditorSetToolOffsetTabs />

        case ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSDOUT:
            return <FlowEditorSetModbusDout />

        case ACTIVITYTYPE.ACTIVITYTYPE_SETMODBUSUIOUT:
            return <FlowEditorSetModbusUiout />

        case ACTIVITYTYPE.ACTIVITYTYPE_NONE:
        case ACTIVITYTYPE.ACTIVITYTYPE_PAUSEPROGRAM:
        case ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEROTATIONATVELOCITY:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEINSTANT:
        case ACTIVITYTYPE.ACTIVITYTYPE_SPINDLE:
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSINTERPOLATED:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINPOS:
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINVELO:
        default:
            return <div>Unknown activity type</div>
    }
}

type FlowEditModalProps = {
    item: ActivityStreamItem
    onSave(item: ActivityStreamItem): void
    onClose(): void
}

export const FlowEditModal = ({ item, onSave, onClose }: FlowEditModalProps) => {
    const [edited, setEdited] = useState<ActivityStreamItem>()

    useEffect(() => {
        setEdited(clone(item))
    }, [item])

    function close() {
        // setEdited(clone(item))
        onClose()
    }

    return (
        <Modal open={!!edited} onCancel={close} onOk={() => onSave(edited)} width="650px">
            <flowEditContext.Provider value={{ item: edited, onChange: setEdited }}>
                <FlowEditor />
            </flowEditContext.Provider>
        </Modal>
    )
}
