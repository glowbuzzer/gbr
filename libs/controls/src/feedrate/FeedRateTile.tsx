import React, { useEffect, useRef, useState } from "react"
import { Tile } from "../tiles"
import { useConfig, useFeedRate } from "@glowbuzzer/store"
import { Select, Slider } from "antd"
import { useLocalStorage } from "../util/LocalStorageHook"

/**
 * The feed rate tile provides a simple way to adjust the feedrate for a kinematics configuration.
 *
 * If multiple kinematics configurations are configured, the tile provides a way to switch between
 * them.
 *
 * The feedrate set affects all moves on the kinematics configuration.
 */
export const FeedRateTile = () => {
    const [selectedKc, setSelectedKc] = useLocalStorage("feedrate.kc", 0)

    const [value, setValueInternal] = useState(0)
    const timer = useRef(null)

    const { kinematicsConfiguration } = useConfig() || {}
    const kcNames = Object.keys(kinematicsConfiguration)

    const options = kcNames.map((label, index) => ({
        label,
        value: index
    }))

    const selectedIndex = Math.min(selectedKc, options.length)

    const kinematics = useFeedRate(selectedIndex)

    const fro = kinematics.froActual
    useEffect(() => {
        timer.current = setTimeout(() => {
            setValueInternal(fro)
        }, 500)
        return () => clearTimeout(timer.current)
    }, [fro])

    function setValue(value) {
        kinematics.setFeedRatePercentage(value)
        setValueInternal(value)
    }

    function update_selected_kc(index) {
        setSelectedKc(index)
    }

    return (
        <Tile
            title="Feedrate"
            fullHeight={false}
            settings={
                options.length > 0 ? (
                    <Select
                        value={selectedIndex}
                        onChange={update_selected_kc}
                        size="small"
                        options={options}
                    />
                ) : undefined
            }
        >
            <Slider
                min={0}
                max={2}
                value={value}
                onChange={setValue}
                step={0.05}
                tooltipVisible={false}
                marks={{
                    0: "0",
                    0.25: "25%",
                    0.5: "50%",
                    0.75: "75%",
                    1: "100%",
                    1.25: "125%",
                    1.5: "150%",
                    1.75: "175%",
                    2: "200%"
                }}
            />
        </Tile>
    )
}
