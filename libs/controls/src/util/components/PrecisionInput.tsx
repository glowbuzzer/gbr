/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { FocusEvent, ForwardedRef, forwardRef, useEffect, useState, WheelEvent } from "react"
import { InputNumber, InputNumberProps } from "antd"
import styled from "styled-components"

const StyledInputNumber = styled(InputNumber)<{ $width?: number }>`
    width: ${props => (props.$width ? `${props.$width + 2}em` : "none")};
`

// ensure value stays within min/max bounds
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min || -Number.MAX_VALUE), max || Number.MAX_VALUE)
}

// check if a string is a valid number
function valid_number(value: string) {
    return !Number.isNaN(Number.parseFloat(value))
}

type PrecisionInputProps = {
    value: number
    onChange?: (value: number) => void
    onBlur?: (e: FocusEvent) => void
    precision: number
    step?: number
    min?: number
    max?: number
    width?: number
}

/**
 * A number input that allows for a specific precision.
 */
export const PrecisionInput = forwardRef(
    (
        { value, onChange, onBlur, precision, step, min, max, width }: PrecisionInputProps,
        ref: ForwardedRef<HTMLInputElement>
    ) => {
        const [valueString, setValueString] = React.useState(value.toFixed(precision))
        const [focused, setFocused] = useState(false)

        useEffect(() => {
            // if valid, immediately call the onChange handler, so caller can update state
            if (valid_number(valueString)) {
                const value = clamp(Number(valueString), min, max)
                onChange?.(value)
            }
        }, [valueString])

        useEffect(() => {
            if (valid_number(valueString)) {
                // ensure we are clamped, but give a delay in case the user is mid-edit
                const value = Number.parseFloat(valueString)
                if (value < min) {
                    const timer = setTimeout(() => setValueString(min.toFixed(precision)), 300)
                    return () => clearTimeout(timer)
                }
                if (value > max) {
                    const timer = setTimeout(() => setValueString(max.toFixed(precision)), 300)
                    return () => clearTimeout(timer)
                }
            }
        }, [valueString])

        useEffect(() => {
            // whenever the value changes, update the input string if not focused
            if (!focused) {
                setValueString(value.toFixed(precision))
            }
        }, [value, focused])

        useEffect(() => {
            if (!valid_number(valueString)) {
                // don't apply precision change if mid-edit
                return
            }
            setValueString(value.toFixed(precision))
        }, [precision])

        function handle_wheel(e: WheelEvent<HTMLInputElement>) {
            if (!valid_number(valueString)) {
                // don't try to update if mid-edit
                return
            }
            const mult = (step ??= 1)
            const new_value =
                Number(valueString) - (Math.sign(e.deltaY) / Math.pow(10, precision)) * mult

            setValueString(new_value.toFixed(precision))
        }

        const handle_step: InputNumberProps["onStep"] = (_v, info) => {
            switch (info.type) {
                case "up":
                    setValueString((Number(valueString) + step).toFixed(precision))
                    break
                case "down":
                    setValueString((Number(valueString) - step).toFixed(precision))
                    break
            }
        }

        function handle_focus() {
            setFocused(true)
        }

        function handle_blur(e: FocusEvent) {
            setFocused(false)
            onBlur?.(e)
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
                onChange={(v: string) => setValueString(v)}
                onFocus={handle_focus}
                onBlur={handle_blur}
                $width={width}
            />
        )
    }
)
