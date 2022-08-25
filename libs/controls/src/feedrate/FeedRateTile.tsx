/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useRef, useState } from "react"
import { Tile } from "../tiles"
import { useConfig, useFeedRate } from "@glowbuzzer/store"
import { Button, Select, Slider } from "antd"
import { useLocalStorage } from "../util/LocalStorageHook"
import { CaretRightFilled, PauseOutlined } from "@ant-design/icons"

const help = (
    <div>
        <h4>Feedrate Tile</h4>
        <p>The Feedrate tile is used to override the default velocity of moves.</p>
        <p>If the feed rate slider is set to more than 100% moves are sped up.</p>
        <p>If the feed rate slider is set to less than 100% moves are slowed down.</p>
        <p>An example of using is would be if you are executing a gcode program and you</p>
        <p>feel you could safely increase the speed (velocity of the tool) then you would</p>
        <p>override the feedate by say 150%.</p>
        <p>Each kinematics configuration (kc) has its own feedrate override so there is a </p>
        <p>drondown to select the kc.</p>
    </div>
)

/**
 * The feed rate tile provides a simple way to adjust the feedrate for a kinematics configuration.
 *
 * If multiple kinematics configurations are configured, the tile provides a way to switch between
 * them.
 *
 * The feedrate set affects all moves on the kinematics configuration.
 *
 * The feed hold button will set the feed rate to zero and give the option to unhold, setting the
 * feed rate to the previous value. Note that when GBC starts or restarts, it sets the feed rate to 100%.
 *
 */
export const FeedRateTile = () => {
    const [selectedKc, setSelectedKc] = useLocalStorage("feedrate.kc", 0)

    const [value, setValueInternal] = useState(0)
    const [feedRestoreValue, setFeedRestoreValue] = useState(null)

    const timer = useRef(null)

    const { kinematicsConfiguration } = useConfig()

    const options = kinematicsConfiguration.map((kc, index) => ({
        label: kc.name,
        value: index
    }))

    // ensure selected index from local storage is value for the current config
    const selectedIndex = Math.min(selectedKc, options.length - 1)

    const { froActual, froTarget, setFeedRatePercentage } = useFeedRate(selectedIndex)

    useEffect(() => {
        // debounce changes to actual fro to avoid confusing behaviour
        // when interacting with the slider
        timer.current = setTimeout(() => {
            setValueInternal(froActual)
        }, 250)
        return () => clearTimeout(timer.current)
    }, [froActual])

    function setValue(value) {
        setFeedRatePercentage(value)
        setValueInternal(value)
    }

    function update_selected_kc(index) {
        setSelectedKc(index)
    }

    function feed_hold() {
        setFeedRestoreValue(froTarget)
        setFeedRatePercentage(0)
    }

    function feed_resume() {
        setFeedRatePercentage(feedRestoreValue)
        setFeedRestoreValue(null)
    }

    return (
        <Tile
            title="Feedrate"
            help={help}
            fullHeight={false}
            settings={
                options.length > 1 ? (
                    <Select
                        value={selectedIndex}
                        onChange={update_selected_kc}
                        size="small"
                        options={options}
                    />
                ) : undefined
            }
            footer={
                feedRestoreValue === null ? (
                    <Button size="small" icon={<PauseOutlined />} onClick={feed_hold}>
                        Feed Hold
                    </Button>
                ) : (
                    <Button size="small" icon={<CaretRightFilled />} onClick={feed_resume}>
                        Resume
                    </Button>
                )
            }
        >
            <Slider
                disabled={feedRestoreValue !== null}
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
