import * as React from "react"
import { useContext } from "react"
import { DockTileWithToolbar } from "../../../../libs/controls/src/dock/DockTileWithToolbar"
import {
    JogTouchWidget,
    JogTouchWidgetMode
} from "../../../../libs/controls/src/jogging/JogTouchWidget"
import styled from "styled-components"
import {
    CartesianJogTileDefinition,
    DockTileDefinitionBuilder,
    DockToolbarButtonGroup,
    XyIcon
} from "@glowbuzzer/controls"
import { GlowbuzzerIcon } from "../../../../libs/controls/src/util/GlowbuzzerIcon"
import { useLocalStorage } from "../../../../libs/controls/src/util/LocalStorageHook"
import { ReactComponent as SpeedIcon } from "@material-symbols/svg-400/outlined/speed.svg"
import { useConnection, useSoloActivity } from "@glowbuzzer/store"
import DisabledContext from "antd/es/config-provider/DisabledContext"
import { AGV_KC_INDEX } from "./constants"

const StyledDiv = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    padding: 10px;
    gap: 30px;

    svg {
        display: inline-block;
    }
`

const AgvJogTile = () => {
    const { connected } = useConnection()
    const motion = useSoloActivity(AGV_KC_INDEX)
    const [lockXy, setLockXy] = useLocalStorage("jog.lock.xy", false)
    const [lockSpeed, setLockSpeed] = useLocalStorage("jog.lock.speed", false)
    const disabled = useContext(DisabledContext)

    async function jog_xy_start(vx: number, vy: number) {
        if (connected) {
            await motion
                .moveVectorAtVelocity(vx, vy, 0)
                .params({ ignoreFeedrateOverride: true })
                .promise()
        }
    }

    async function jog_z_start(_vx: number, vy: number) {
        if (connected) {
            await motion
                .moveRotationAtVelocity(0, 0, vy)
                .params({ ignoreFeedrateOverride: true })
                .promise()
        }
    }

    function jog_end() {
        if (connected) {
            return motion.cancel().promise()
        }
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <DockToolbarButtonGroup>
                    <GlowbuzzerIcon
                        useFill={true}
                        Icon={XyIcon}
                        button
                        title="Lock XY"
                        checked={lockXy}
                        onClick={() => setLockXy(!lockXy)}
                    />
                    <GlowbuzzerIcon
                        useFill={true}
                        Icon={SpeedIcon}
                        button
                        title="Lock Full Speed"
                        checked={lockSpeed}
                        onClick={() => setLockSpeed(!lockSpeed)}
                    />
                </DockToolbarButtonGroup>
            }
        >
            <StyledDiv>
                <JogTouchWidget
                    mode={JogTouchWidgetMode.XY}
                    lockXy={lockXy}
                    lockSpeed={lockSpeed}
                    onJogStart={jog_xy_start}
                    onJogEnd={jog_end}
                    disabled={disabled}
                />
                <JogTouchWidget
                    mode={JogTouchWidgetMode.VERTICAL}
                    lockXy={lockXy}
                    lockSpeed={lockSpeed}
                    onJogStart={jog_z_start}
                    onJogEnd={jog_end}
                    disabled={disabled}
                />
            </StyledDiv>
        </DockTileWithToolbar>
    )
}

export const AgvJogTileDefinition = DockTileDefinitionBuilder()
    .id("agv-jog")
    .name("AGV Jog")
    .placement(2, 0)
    .render(() => <AgvJogTile />)
    .build()
