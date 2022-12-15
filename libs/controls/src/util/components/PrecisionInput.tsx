import React, { useEffect, useRef, WheelEvent } from "react"
import { InputNumber } from "antd"

/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

type PrecisionInputProps = {
    value: number
    onChange: (value: number) => void
    precision: number
}
export const PrecisionInput = ({ value, onChange, precision }) => {
    const [valueString, setValueString] = React.useState(value.toFixed(precision))
    const valueRef = useRef(value) // initial value

    useEffect(() => {
        if (!Number.isNaN(valueString)) {
            onChange(Number(valueString))
        }
    }, [valueString])

    useEffect(() => {
        if (Number.isNaN(valueString)) {
            // don't apply precision change if mid-edit
            return
        }
        if (valueRef.current === value) {
            setValueString(value.toFixed(precision))
        } else {
            const new_value = Number(valueString)
            setValueString(new_value.toFixed(precision))
            valueRef.current = new_value
        }
    }, [precision])

    function update_value(v) {
        setValueString(v)
    }

    function handle_wheel(e: WheelEvent<HTMLInputElement>) {
        if (Number.isNaN(valueString)) {
            // don't try to update if mid-edit
            return
        }
        const new_value = Number(valueString) - Math.sign(e.deltaY) / Math.pow(10, precision)
        update_value(new_value.toFixed(precision))
    }

    return (
        <InputNumber
            value={valueString}
            size="small"
            step={1 / Math.pow(10, precision)}
            onWheel={handle_wheel}
            onChange={update_value}
        />
    )
}
