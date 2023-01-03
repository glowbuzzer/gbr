/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { Button, Input } from "antd"
import {
    LIMITPROFILE,
    MoveParametersConfig,
    usePrefs,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined
} from "@ant-design/icons"
import { useLocalStorage } from "../util/LocalStorageHook"
import { JogDirection, JogMode } from "./types"
import { PositionMode } from "./JogGotoCartesian"
import { useEffect, useRef } from "react"

const ArrowsDiv = styled.div`
    display: flex;
    margin: 4px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.05);
`

const ButtonLayoutDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    zoom: 0.8;
    padding: 10px;

    div {
        display: flex;
        justify-content: center;
        gap: 44px;
    }
`

const StyledInput = styled(Input)`
    width: 100%;
    display: inline-block;
`

type JogArrowsCartesianProps = {
    jogMode: JogMode
    positionMode: PositionMode
    jogSpeed: number
    kinematicsConfigurationIndex: number
    frameIndex: number
}

/** @ignore - internal to the jog tile */
export const JogArrowsCartesian = ({
    jogMode,
    positionMode,
    jogSpeed,
    kinematicsConfigurationIndex,
    frameIndex
}: JogArrowsCartesianProps) => {
    const preview = usePreview()
    const [jogStep, setJogStep] = useLocalStorage(
        "jog.cartesian.step." + PositionMode[positionMode],
        positionMode === PositionMode.POSITION ? 100 : 0.1
    )
    const { getUnits, toSI } = usePrefs()
    const jogging = useRef(false)

    useEffect(() => {
        const fn = (index, direction) => {
            document.removeEventListener("keydown", onKeyDown)
            jogging.current = true

            if (jogMode === JogMode.STEP) {
                return stepJog(index, direction)
            } else {
                return startJog(index, direction)
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowUp") {
                return fn(0, JogDirection.POSITIVE)
            } else if (event.key === "ArrowDown") {
                return fn(0, JogDirection.NEGATIVE)
            } else if (event.key === "ArrowLeft") {
                return fn(1, JogDirection.NEGATIVE)
            } else if (event.key === "ArrowRight") {
                return fn(1, JogDirection.POSITIVE)
            }
        }

        const onKeyUp = (event: KeyboardEvent) => {
            if (jogging.current) {
                stopJog().then(() => {
                    document.addEventListener("keydown", onKeyDown)
                })
                jogging.current = false
            }
        }

        document.addEventListener("keydown", onKeyDown)
        document.addEventListener("keyup", onKeyUp)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.removeEventListener("keyup", onKeyUp)
        }
    }, [jogMode, stepJog, startJog, stopJog])

    const motion = useSoloActivity(kinematicsConfigurationIndex)

    function updateJogStep(e) {
        setJogStep(e.target.value)
    }

    // we scale all limits by the jog speed percent
    const move_params: MoveParametersConfig = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed,
        limitConfigurationIndex: LIMITPROFILE.LIMITPROFILE_JOGGING
    }

    function startJog(index, direction: JogDirection) {
        function ortho_vector(axis: number, direction: JogDirection) {
            return axis === index
                ? direction === JogDirection.POSITIVE
                    ? 1
                    : direction === JogDirection.NEGATIVE
                    ? -1
                    : 0
                : 0
        }

        if (jogMode === JogMode.CONTINUOUS) {
            preview.disable()
            const activity =
                positionMode === PositionMode.ORIENTATION
                    ? motion.moveRotationAtVelocity(
                          ortho_vector(0, direction),
                          ortho_vector(1, direction),
                          ortho_vector(2, direction)
                      )
                    : motion.moveVectorAtVelocity(
                          ortho_vector(0, direction),
                          ortho_vector(1, direction),
                          ortho_vector(2, direction)
                      )

            return activity.params(move_params).promise().finally(preview.enable)
        }
    }

    function stopJog() {
        if (jogMode === JogMode.CONTINUOUS) {
            return motion.cancel().promise()
        }
    }

    function stepJog(index, direction: JogDirection) {
        if (jogMode === JogMode.STEP) {
            const step = toSI(
                Number(jogStep),
                positionMode === PositionMode.POSITION ? "linear" : "angular"
            )
            const [x, y, z] = [0, 1, 2].map(n =>
                index === n ? (direction === JogDirection.POSITIVE ? step : -step) : 0
            )

            preview.disable()
            const builder =
                positionMode === PositionMode.POSITION
                    ? motion.moveLine(x, y, z)
                    : motion.moveLine().rotationEuler(x, y, z)

            return builder
                .frameIndex(frameIndex)
                .relative()
                .params(move_params)
                .promise()
                .finally(preview.enable)
        }
    }

    function JogButton({ index, direction, children }) {
        return (
            <Button
                onClick={() => stepJog(index, direction)}
                onMouseDown={() => startJog(index, direction)}
                onMouseUp={() => stopJog()}
            >
                {children}
            </Button>
        )
    }

    return (
        <>
            <ArrowsDiv>
                <ButtonLayoutDiv>
                    <div>
                        <JogButton index={1} direction={JogDirection.POSITIVE}>
                            <ArrowUpOutlined />
                        </JogButton>
                    </div>
                    <div>
                        <JogButton index={0} direction={JogDirection.NEGATIVE}>
                            <ArrowLeftOutlined />
                        </JogButton>
                        <JogButton index={0} direction={JogDirection.POSITIVE}>
                            <ArrowRightOutlined />
                        </JogButton>
                    </div>
                    <div>
                        <JogButton index={1} direction={JogDirection.NEGATIVE}>
                            <ArrowDownOutlined />
                        </JogButton>
                    </div>
                </ButtonLayoutDiv>
                <ButtonLayoutDiv>
                    <div>
                        <JogButton index={2} direction={JogDirection.POSITIVE}>
                            <ArrowUpOutlined />
                        </JogButton>
                    </div>
                    <div>
                        <JogButton index={2} direction={JogDirection.NEGATIVE}>
                            <ArrowDownOutlined />
                        </JogButton>
                    </div>
                </ButtonLayoutDiv>
            </ArrowsDiv>
            <StyledInput
                value={jogStep}
                onChange={updateJogStep}
                disabled={jogMode !== JogMode.STEP}
                addonBefore={"Distance"}
                addonAfter={getUnits(positionMode === PositionMode.POSITION ? "linear" : "angular")}
            />
        </>
    )
}
