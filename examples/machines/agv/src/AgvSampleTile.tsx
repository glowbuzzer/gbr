import * as React from "react"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"
import { STREAMSTATE, useSoloActivity, useStream, useTelemetryControls } from "@glowbuzzer/store"
import { Button, Space } from "antd"
import { AGV_KC_INDEX } from "./constants"

export const AgvSampleTile = () => {
    const { execute, state } = useStream(AGV_KC_INDEX)
    const api = useSoloActivity(AGV_KC_INDEX)
    const { cancelCapture } = useTelemetryControls()

    const busy = state !== STREAMSTATE.STREAMSTATE_IDLE

    async function rotate_then_move() {
        await execute(api => [
            api.moveLine().rotationEuler(0, 0, Math.PI / 4),
            api.moveLine(10, 0, 0)
        ])
    }

    async function rotate_and_move() {
        await execute(api => [api.moveLine(10, 0, 0).rotationEuler(0, 0, Math.PI / 4)])
    }

    async function reset_position() {
        cancelCapture()
        await api.setInitialPosition(0, 0, 0).rotationEuler(0, 0, 0).promise()
    }

    return (
        <StyledTileContent>
            <Space>
                <Button size="small" onClick={reset_position} disabled={busy}>
                    Reset Position
                </Button>
                <Button size="small" onClick={rotate_then_move} disabled={busy}>
                    Rotate then Move
                </Button>
                <Button size="small" onClick={rotate_and_move} disabled={busy}>
                    Rotate and Move
                </Button>
            </Space>
        </StyledTileContent>
    )
}
