/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useRef, useState } from "react"
import { useConfig, useFeedRate, useKinematicsConfigurationList } from "@glowbuzzer/store"
import { Slider } from "antd"
import { useLocalStorage } from "../util/LocalStorageHook"
import { CaretRightFilled, PauseOutlined } from "@ant-design/icons"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { GlowbuzzerIcon } from "../util/GlowbuzzerIcon"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"

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
    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useLocalStorage(
        "feedrate.kc",
        0
    )

    const [value, setValueInternal] = useState(0)
    const [feedRestoreValue, setFeedRestoreValue] = useState(null)

    const timer = useRef(null)

    const kinematics = useKinematicsConfigurationList()

    const options = kinematics.map((kc, index) => ({
        title: kc.name,
        value: index
    }))

    // ensure selected index from local storage is value for the current config
    const selectedIndex = Math.min(kinematicsConfigurationIndex, options.length - 1)

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

    function feed_hold() {
        setFeedRestoreValue(froTarget)
        setFeedRatePercentage(0)
    }

    function feed_resume() {
        setFeedRatePercentage(feedRestoreValue)
        setFeedRestoreValue(null)
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <DockToolbarButtonGroup>
                        {feedRestoreValue === null ? (
                            <GlowbuzzerIcon
                                Icon={PauseOutlined}
                                button
                                onClick={feed_hold}
                                title="Feed Hold"
                            />
                        ) : (
                            <GlowbuzzerIcon
                                Icon={CaretRightFilled}
                                button
                                onClick={feed_resume}
                                title="Resume"
                            />
                        )}
                    </DockToolbarButtonGroup>
                    <DockToolbarButtonGroup>
                        <KinematicsDropdown
                            value={kinematicsConfigurationIndex}
                            onChange={setKinematicsConfigurationIndex}
                        />
                    </DockToolbarButtonGroup>
                </>
            }
        >
            <StyledTileContent>
                <Slider
                    disabled={feedRestoreValue !== null}
                    min={0}
                    max={2}
                    value={value}
                    onChange={setValue}
                    step={0.05}
                    tooltip={{ open: false }}
                    style={{ width: "95%" }}
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
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
