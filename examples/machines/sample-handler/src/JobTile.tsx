import styled from "styled-components"
import { Button, Space } from "antd"
import { useStream } from "@glowbuzzer/store"
import { appSlice, SampleLocation } from "./store"
import { useDispatch } from "react-redux"
import { sample_positions } from "./constants"

const StyledDiv = styled.div`
    padding: 10px;
`

export const JobTile = () => {
    const { execute } = useStream(0)
    const dispatch = useDispatch()

    function set_location(location: SampleLocation) {
        dispatch(appSlice.actions.setLocation(location))
    }

    function goto(location: SampleLocation) {
        const position = sample_positions[location]
        if (!position) {
            console.log("Invalid location: ", location)
            return
        }
        const [x, y, z] = position
        return execute(api => api.moveToPosition(x, y, z).frameIndex(0))
    }

    function run_sequence() {
        return execute(api => {
            function approach_retreat(location: SampleLocation, pick: boolean, safe_z: number) {
                const pos = sample_positions[location]
                const [x, y, z] = pos
                return [safe_z, 0, safe_z].map((y_offset, index) => {
                    return api
                        .moveToPosition(x, y + y_offset, z)
                        .frameIndex(0)
                        .promise()
                        .then(() => {
                            if (index === 1) {
                                set_location(pick ? SampleLocation.ROBOT : location)
                            }
                        })
                })
            }

            set_location(SampleLocation.PICK)
            return [
                approach_retreat(SampleLocation.PICK, true, 0.2),
                approach_retreat(SampleLocation.CENTRIFUGE, false, 0.27),
                approach_retreat(SampleLocation.CENTRIFUGE, true, 0.27),
                approach_retreat(SampleLocation.PLACE, false, 0.2)
            ].flat()
        })
    }

    return (
        <StyledDiv>
            <Space direction="vertical">
                <Space>
                    <Button onClick={() => set_location(SampleLocation.ROBOT)}>SHOW ROBOT</Button>
                    <Button onClick={() => set_location(SampleLocation.PICK)}>SHOW PICK</Button>
                    <Button onClick={() => set_location(SampleLocation.CENTRIFUGE)}>
                        SHOW CENTRIFUGE
                    </Button>
                    <Button onClick={() => set_location(SampleLocation.PLACE)}>SHOW PLACE</Button>
                </Space>
                <Space>
                    <Button onClick={() => goto(SampleLocation.PICK)}>GOTO PICK</Button>
                    <Button onClick={() => goto(SampleLocation.CENTRIFUGE)}>GOTO CENTRIFUGE</Button>
                    <Button onClick={() => goto(SampleLocation.PLACE)}>GOTO PLACE</Button>
                </Space>
                <Space>
                    <Button onClick={run_sequence}>RUN SEQUENCE</Button>
                </Space>
            </Space>
        </StyledDiv>
    )
}
