/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { usePrefs, Vector3 } from "@glowbuzzer/store"
import { Space } from "antd"
import { PrecisionInput } from "../util"

type TranslationEditProps = {
    item: Vector3
    onChange: (item: Vector3) => void
}

export const TranslationEdit = ({ item, onChange }: TranslationEditProps) => {
    const { toSI, fromSI, getUnits } = usePrefs()
    const { units: linearUnits, precision: linearPrecision } = getUnits("linear")

    return (
        <Space>
            {["x", "y", "z"].map(axis => (
                <div className="input" key={"t-" + axis}>
                    {axis.toUpperCase()}{" "}
                    <PrecisionInput
                        value={fromSI(item[axis], "linear")}
                        onChange={v =>
                            onChange({
                                ...item,
                                [axis]: toSI(v, "linear")
                            })
                        }
                        precision={linearPrecision}
                    />
                </div>
            ))}
            <div>{linearUnits}</div>
        </Space>
    )
}
