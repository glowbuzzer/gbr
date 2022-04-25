import * as React from "react"
import { useState } from "react"
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
import { FrameSelector } from "@glowbuzzer/controls"
import { useLocalStorage } from "../util/LocalStorageHook"
import { JogDirection, JogMode } from "./types"

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
    kinematicsConfigurationIndex: number
    jogMode: JogMode
    jogSpeed: number
    defaultFrameIndex: number
}

export const JogArrowsCartesian = ({
    kinematicsConfigurationIndex,
    jogMode,
    jogSpeed,
    defaultFrameIndex
}: JogArrowsCartesianProps) => {
    const preview = usePreview()
    const motion = useSoloActivity(kinematicsConfigurationIndex)
    const [selectedFrame, setSelectedFrame] = useState(defaultFrameIndex)
    const [jogStep, setJogStep] = useLocalStorage("jog.step", 100)
    const { getUnits, toSI } = usePrefs()

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
            return motion
                .moveLineAtVelocity(
                    ortho_vector(0, direction),
                    ortho_vector(1, direction),
                    ortho_vector(2, direction)
                )
                .params(move_params)
                .promise()
                .finally(preview.enable)
        }
    }

    function stopJog() {
        if (jogMode === JogMode.CONTINUOUS) {
            return motion.cancel().promise()
        }
    }

    function stepJog(index, direction: JogDirection) {
        if (jogMode === JogMode.STEP) {
            const step = toSI(Number(jogStep), "linear")
            const [x, y, z] = [0, 1, 2].map(n =>
                index === n ? (direction === JogDirection.POSITIVE ? step : -step) : 0
            )

            preview.disable()
            return motion
                .moveLine(x, y, z)
                .frameIndex(selectedFrame)
                .relative()
                .params(move_params)
                .promise()
                .finally(preview.enable)
            // }
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
            <div className="frame">
                Frame:{" "}
                <FrameSelector
                    onChange={setSelectedFrame}
                    value={selectedFrame}
                    defaultFrame={defaultFrameIndex}
                    hideWorld
                />
            </div>
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
                addonAfter={getUnits("linear")}
            />
        </>
    )
}
