/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, {
    FocusEventHandler,
    ForwardedRef,
    forwardRef,
    useEffect,
    useRef,
    WheelEvent
} from "react"
import { InputNumber } from "antd"
import styled from "styled-components"

const StyledInputNumber = styled(InputNumber)<{ $width?: number }>`
    width: ${props => (props.$width ? `${props.$width + 2}em` : "none")};
`

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min || Number.MIN_VALUE), max || Number.MAX_VALUE)
}

type PrecisionInputProps = {
    value: number
    onChange?: (value: number) => void
    onBlur?: FocusEventHandler<HTMLInputElement>
    precision: number
    step?: number
    min?: number
    max?: number
    width?: number
}
export const PrecisionInput = forwardRef(
    (
        { value, onChange, onBlur, precision, step, min, max, width }: PrecisionInputProps,
        ref: ForwardedRef<HTMLInputElement>
    ) => {
        const [valueString, setValueString] = React.useState(value.toFixed(precision))
        const valueRef = useRef(value) // initial value
        const timerValueStringRef = useRef(null)
        const timerValueRef = useRef(null)

        useEffect(() => {
            if (!Number.isNaN(valueString)) {
                const value = clamp(Number(valueString), min, max)
                onChange(value)
            }
        }, [valueString])

        useEffect(() => {
            clearTimeout(timerValueStringRef.current)
            if (!Number.isNaN(valueString)) {
                // ensure we are clamped, but give a delay in case the user is mid-edit
                const value = Number(valueString)
                if (value < min) {
                    timerValueStringRef.current = setTimeout(
                        () => setValueString(min.toFixed(precision)),
                        300
                    )
                }
                if (value > max) {
                    timerValueStringRef.current = setTimeout(
                        () => setValueString(max.toFixed(precision)),
                        300
                    )
                }
            }
        }, [valueString])

        useEffect(() => {
            clearTimeout(timerValueRef.current)
            timerValueRef.current = setTimeout(() => {
                setValueString(value.toFixed(precision))
            }, 750)
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
            <StyledInputNumber
                ref={ref}
                value={valueString}
                onStep={step ? handle_step : undefined}
                size="small"
                step={1 / Math.pow(10, precision)}
                min={min}
                max={max}
                onWheel={handle_wheel}
                onChange={update_value}
                onBlur={onBlur}
                $width={width}
            />
        )
    }
)
