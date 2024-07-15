import * as React from "react"
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react"
import { Input, InputNumber } from "antd"

interface HexDecInputProps {
    isHex: boolean
    address: number | null // or number if address cannot be null
    update_address: (index: number, value: number) => void
    index: number
}

/**
 * A component that allows the user to input a hex or decimal value.
 * @param isHex
 * @param address
 * @param update_address
 * @param index
 * @constructor
 */
export const HexDecInput: React.FC<HexDecInputProps> = ({
    isHex,
    address,
    update_address,
    index
}) => {
    // Local state for the input value
    const [localValue, setLocalValue] = useState<string>("")

    // Initialize local state when input.address changes
    useEffect(() => {
        if (isHex) {
            setLocalValue(address ? address.toString(16).toUpperCase() : "")
        } else {
            setLocalValue(address ? address.toString(10) : "")
        }
    }, [address, isHex])

    const handleHexKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"]
        if (!allowedKeys.includes(e.key) && /[^0-9a-fA-F]/.test(e.key)) {
            e.preventDefault()
        }
    }

    const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        setLocalValue(value)
        if (/^[0-9A-F]*$/.test(value)) {
            const numericValue = parseInt(value, 16)
            if (!isNaN(numericValue)) {
                update_address(index, numericValue)
            }
        }
    }

    const handleDecimalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "-", "+", "."].includes(e.key)) {
            e.preventDefault()
        }
    }

    const handleDecimalChange = (value: number | null) => {
        setLocalValue(value !== null ? value.toString() : "")
        const numericValue = value !== null ? parseInt(value.toString(), 10) : NaN
        if (!isNaN(numericValue)) {
            update_address(index, numericValue)
        }
    }

    return (
        <div style={{ display: "flex", width: "70px" }}>
            {isHex ? (
                <Input
                    type="text"
                    value={localValue}
                    size="small"
                    prefix="0X"
                    maxLength={4}
                    onChange={handleHexChange}
                    onKeyDown={handleHexKeyDown}
                />
            ) : (
                <InputNumber
                    type="number"
                    value={Number(localValue)}
                    size="small"
                    onChange={handleDecimalChange}
                    min={0}
                    max={65535}
                    step={1}
                    onKeyDown={handleDecimalKeyDown}
                />
            )}
        </div>
    )
}
