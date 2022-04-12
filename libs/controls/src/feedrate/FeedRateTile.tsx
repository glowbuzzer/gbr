import React from "react"
import { Tile } from "../tiles"
import { useFeedRate } from "@glowbuzzer/store"
import { InputNumber } from "antd"

export const FeedRateTile = () => {
    const kinematics = useFeedRate(0)

    function onChange(value) {
        kinematics.setFeedRatePercentage(value)
    }

    return (
        <Tile title="Feedrate">
            <div>Current: {kinematics.froActual * 100}%</div>
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
