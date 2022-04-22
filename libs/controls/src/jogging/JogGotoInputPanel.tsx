import React, { useEffect, useRef, useState } from "react"
import { Button, Input } from "antd"
import { ConversionFactors, usePrefs } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import styled from "styled-components"

export type JogGotoItem = {
    key: string
    type: "linear" | "angular"
    label: string
}

const StyledDiv = styled.div`
    .invalid .ant-input {
        border: 1px solid red;
        background: rgba(255, 0, 0, 0.1);
    }

    > div {
        display: flex;

        .ant-input-group-wrapper {
            width: 0;
            min-width: 167px;
        }

        .ant-input {
            width: 0;
            min-width: 120px;
        }

        .ant-btn:nth-child(2) {
            width: 150px;
        }

        .ant-btn:nth-child(3) {
            width: 80px;
        }
    }
`

type JogGotoInputPanelProps = {
    localStorageKey: string
    items: JogGotoItem[]
}

export const JogGotoInputPanel = ({ localStorageKey, items }: JogGotoInputPanelProps) => {
    const { getUnits } = usePrefs()
    const [values, setValues] = useLocalStorage<string[]>(localStorageKey, [])

    const linearUnits = getUnits("linear")
    const linearUnitsRef = useRef(linearUnits)

    const angularUnits = getUnits("angular")
    const angularUnitsRef = useRef(angularUnits)

    useEffect(() => {
        setValues(current => {
            const values = items.map(({ type }, index) => {
                let value = Number(current[index]) || 0

                const from = ConversionFactors[linearUnitsRef.current]
                const to = ConversionFactors[linearUnits]
                if (type === "linear" && linearUnits !== linearUnitsRef.current) {
                    console.log("CONVERT", linearUnitsRef.current, linearUnits, value, from, to)
                    value = (value * from) / to
                    console.log("NEW VALUE", value)
                }

                // return "100"
                return value.toFixed(2)
                // return type === "linear" ? "xxxx" : "yyyy"
            })

            linearUnitsRef.current = linearUnits
            angularUnitsRef.current = angularUnits

            console.log("VALUES IN USE EFFECT", values)
            return values
        })
    }, [items, linearUnits, angularUnits, setValues])

    function update_position(index: number, value: string) {
        setValues(current => current.map((v, i) => (index === i ? value : v)))
    }

    const invalid = items.map((_, index) => isNaN(Number(values[index])))

    console.log("VALUES", values)

    return (
        <StyledDiv>
            {values.map((v, index) => {
                console.log("VALUE", v)
                const { label, type } = items[index]
                return (
                    <div>
                        <Input
                            className={invalid[index] ? "invalid" : ""}
                            addonAfter={getUnits(type)}
                            value={values[index]}
                            onChange={e => update_position(index, e.target.value)}
                        />
                        <Button onClick={() => {}}>Go to {label}</Button>
                        <Button onClick={() => update_position(index, "0")}>Zero</Button>
                    </div>
                )
            })}
            <div>
                <Button block={true} onClick={() => {}}>
                    Go to All
                </Button>
            </div>
        </StyledDiv>
    )
}
