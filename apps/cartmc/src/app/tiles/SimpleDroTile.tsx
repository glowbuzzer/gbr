import * as React from "react"
import { Tile } from "@glowbuzzer/layout"
import { CartesianDro, SegmentDisplay } from "@glowbuzzer/controls"
import { useKinematics } from "@glowbuzzer/store"
import { Col, Row, Table } from "antd"
import styled from "styled-components"

const RightCol = styled(Col)`
    text-align: right;
`
export const SimpleDroTile = () => {
    const kc = useKinematics(0, 0)
    const { x, y } = kc.pose.position

    return (
        <Tile title="Digital Readout">
            <CartesianDro kinematicsConfigurationIndex={0} hideFrameSelect={true} select="x,y" />
        </Tile>
    )
}
