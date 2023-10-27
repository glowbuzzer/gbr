/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { useDigitalInputs, useDigitalOutputStates } from "@glowbuzzer/store"
import { SplitStateIndicator } from "./components/SplitStateIndicator"
import { StateIndicator } from "./components/StateIndicator"
import { PoweroffOutlined } from "@ant-design/icons"
import { EStopButton } from "./components/EStopButton"
import { RemoteControlButton } from "./components/RemoteControlButton"
import { DigitalInputs, DigitalOutputs } from "./types"

const StyledDiv = styled.div`
    padding: 10px;

    .buttons {
        text-align: center;
    }
`

type AwTubeStatusTileProps = {
    showSoftwareStop?: boolean
    showToolInputs?: boolean
    showToolOutputs?: boolean
}

export const AwTubeStatusTile = ({
    showSoftwareStop = false,
    showToolInputs = false,
    showToolOutputs = false
}: AwTubeStatusTileProps) => {
    const inputs = useDigitalInputs()
    const outputs = useDigitalOutputStates()

    return (
        <StyledDiv>
            <div className="buttons">
                <RemoteControlButton size={60} />
                <EStopButton size={60} />
            </div>
            <StateIndicator
                label={
                    <>
                        <PoweroffOutlined /> POWER
                    </>
                }
                value={inputs[DigitalInputs.POWER]}
            />
            <StateIndicator
                label={"SAFE STOP"}
                negative
                inverted
                value={inputs[DigitalInputs.SAFE_STOP]}
            />
            {showSoftwareStop && (
                <StateIndicator
                    label={"SOFTWARE STOP"}
                    negative
                    inverted
                    value={inputs[DigitalInputs.SW_STOP]}
                />
            )}
            {showToolInputs && (
                <SplitStateIndicator
                    items={[
                        {
                            label: "Tool 1 Input",
                            value: inputs[DigitalInputs.TOOL1]
                        },
                        {
                            label: "Tool 2 Input",
                            value: inputs[DigitalInputs.TOOL2]
                        }
                    ]}
                />
            )}
            {showToolOutputs && (
                <SplitStateIndicator
                    items={[
                        {
                            label: "Tool 1 Output",
                            value: outputs[DigitalOutputs.TOOL1]?.effectiveValue
                        },
                        {
                            label: "Tool 2 Output",
                            value: outputs[DigitalOutputs.TOOL2]?.effectiveValue
                        }
                    ]}
                />
            )}
            <StateIndicator
                label={<>Brake Chopper Error!</>}
                value={inputs[DigitalInputs.BR_CHOPPER_ERROR]}
                negative
                hideWhenInactive
            />
        </StyledDiv>
    )
}

export const AwTubeTileDefinitionBuilder = (props: AwTubeStatusTileProps) =>
    DockTileDefinitionBuilder()
        .id("awtube")
        .placement(2, 0)
        .name("AwTube Status")
        .render(() => <AwTubeStatusTile {...props} />)
        .build()
