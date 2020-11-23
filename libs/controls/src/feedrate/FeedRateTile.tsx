import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { useKinematics } from "@glowbuzzer/store"
import { InputNumber } from "antd"

export const FeedRateTile = () => {
    const kinematics = useKinematics(0, 0)

    function onChange(value) {
        kinematics.setFroPercentage(value)
    }

    return (
        <Tile title="Feedrate">
            <div>Current: {kinematics.froActual}</div>
            <div>
                <InputNumber
                    defaultValue={kinematics.froActual * 100}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace("%", "")}
                    onChange={onChange}
                />
            </div>
        </Tile>
    )
}
