import { useSampleState } from "./store"
import { SampleTube } from "./SampleTube"
import { sample_positions } from "./constants"

export const SampleTubeAtLocation = () => {
    const { location } = useSampleState()

    const position = sample_positions[location]
    if (!position) {
        return null
    }
    const [x, y, z] = position

    return (
        <group position={[x, y - 0.135, z]}>
            <SampleTube />
        </group>
    )
}
