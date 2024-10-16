/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useContext, useEffect, useRef } from "react"
import { Button, Input } from "antd"
import { ConversionFactors, usePrefs } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import styled from "styled-components"
import DisabledContext from "antd/es/config-provider/DisabledContext"

export type JogGotoItem = {
    key: string | number
    type: "linear" | "angular"
    label: string
}

const StyledDiv = styled.div`
    padding: 8px 0;

    .invalid .ant-input {
        border: 1px solid red;
        background: rgba(255, 0, 0, 0.1);
    }

    > div {
        display: flex;

        .ant-input-group-wrapper {
            max-width: 180px;
            flex-grow: 3;

            .ant-input-wrapper {
                .ant-input {
                }

                .ant-input-group-addon {
                    width: 50px;
                }
            }
        }

        .ant-btn:nth-child(2) {
            flex-basis: 0;
            flex-grow: 1;
            padding: 0 20px;
        }

        .ant-btn:nth-child(3) {
            flex-basis: 0;
            flex-grow: 1;
            padding: 0 20px;
        }
    }
`

type JogGotoInputPanelProps = {
    localStorageKey: string
    items: JogGotoItem[]
    onGoto(key: string | number, value: number)
    onGotoAll(values: { [index: string]: number })
}

// we need to pass the same empty array to useLocalStorage to avoid infinite loop
const EMPTY_ARRAY = []

/** @ignore - internal to the jog tile */
export const JogGotoInputPanel = ({
    localStorageKey,
    items,
    onGoto,
    onGotoAll
}: JogGotoInputPanelProps) => {
    const { toSI, getUnits } = usePrefs()
    const [values, setValues] = useLocalStorage<string[]>(localStorageKey, EMPTY_ARRAY)
    const disabled = useContext(DisabledContext)

    const { units: linearUnits } = getUnits("linear")
    const linearUnitsRef = useRef(linearUnits)

    const { units: angularUnits } = getUnits("angular")
    const angularUnitsRef = useRef(angularUnits)

    useEffect(() => {
        setValues(current => {
            const values = items.map(({ type }, index) => {
                let value = Number(current[index]) || 0

                if (type === "linear" && linearUnits !== linearUnitsRef.current) {
                    const from = ConversionFactors[linearUnitsRef.current]
                    const to = ConversionFactors[linearUnits]
                    value = (value * from) / to
                }

                if (type === "angular" && angularUnits !== angularUnitsRef.current) {
                    const from = ConversionFactors[angularUnitsRef.current]
                    const to = ConversionFactors[angularUnits]
                    value = (value * from) / to
                }

                return value.toString()
            })

            linearUnitsRef.current = linearUnits
            angularUnitsRef.current = angularUnits

            return values
        })
    }, [items, linearUnits, angularUnits, setValues])

    function update_position(index: number, value: string) {
        setValues(current => current.map((v, i) => (index === i ? value : v)))
    }

    const invalid = items.map((_, index) => isNaN(Number(values[index])))

    function goto(key: string | number, index: number) {
        // always execute in SI units
        const value = toSI(Number(values[index]), items[index].type)
        onGoto(key, value)
    }

    function goto_all() {
        onGotoAll(
            Object.fromEntries(
                items.map(({ key, type }, index) => [key, toSI(Number(values[index]), type)])
            )
        )
    }

    return (
        <StyledDiv>
            {items.map(({ key, type, label }, index) => {
                const { units } = getUnits(type)
                return (
                    <div key={index}>
                        <Input
                            size="small"
                            className={invalid[index] ? "invalid" : ""}
                            addonAfter={units}
                            value={values[index]}
                            onChange={e => update_position(index, e.target.value)}
                        />
                        <Button
                            size="small"
                            onClick={() => goto(key, index)}
                            disabled={disabled || invalid[index]}
                        >
                            Go to {label}
                        </Button>
                        <Button
                            size="small"
                            onClick={() => update_position(index, "0")}
                            disabled={disabled}
                        >
                            Zero
                        </Button>
                    </div>
                )
            })}
            {items.length > 1 && (
                <div>
                    <Button
                        size="small"
                        block={true}
                        onClick={goto_all}
                        disabled={disabled || invalid.some(p => p)}
                    >
                        Go to All
                    </Button>
                </div>
            )}
        </StyledDiv>
    )
}
