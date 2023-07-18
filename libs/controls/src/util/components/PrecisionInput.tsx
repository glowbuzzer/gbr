import React, { useEffect, useRef, WheelEvent } from "react"
import { InputNumber } from "antd"

/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

type PrecisionInputProps = {
    value: number
    onChange: (value: number) => void
    precision: number
    step?: number
}
export const PrecisionInput = ({ value, onChange, precision, step }: PrecisionInputProps) => {
    const [valueString, setValueString] = React.useState(value.toFixed(precision))
    const valueRef = useRef(value) // initial value

    useEffect(() => {
        if (!Number.isNaN(valueString)) {
            onChange(Number(valueString))
        }
    }, [valueString])

    useEffect(() => {
        setValueString(value.toFixed(precision))
    }, [value])

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
        const mult = (step ??= 1)
        const new_value =
            Number(valueString) - (Math.sign(e.deltaY) / Math.pow(10, precision)) * mult
        update_value(new_value.toFixed(precision))
    }

    function handle_step(v, info) {
        switch (info.type) {
            case "up":
                update_value((Number(valueString) + step).toFixed(precision))
                break
            case "down":
                update_value((Number(valueString) - step).toFixed(precision))
                break
        }
    }

    return (
        <InputNumber
            value={valueString}
            onStep={step ? handle_step : undefined}
            size="small"
            step={1 / Math.pow(10, precision)}
            onWheel={handle_wheel}
            onChange={update_value}
        />
    )
}
