import { useSampleState } from "./store"
import { SampleTube } from "./SampleTube"
import { sample_positions } from "./constants"
import { useJointPositions } from "@glowbuzzer/store"

export const SampleTubeAtLocation = () => {
    const { location } = useSampleState()
    const [rot] = useJointPositions(1)

    const position = sample_positions[location]
    if (!position) {
        return null
    }
    const [x, y, z] = position

    return (
        <group position={[x, y - 0.135, z]} rotation={[0, rot, 0]}>
            <SampleTube />
        </group>
    )
}
