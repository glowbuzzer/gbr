import * as React from "react"
import { useEffect } from "react"
import { useConfig, useTelemetryData } from "@glowbuzzer/store"
import { Line } from "@react-three/drei"
import { Euler, Quaternion } from "three"
import { AGV_KC_INDEX } from "../constants"

/**
 * Attempt to draw the tracks of the AGV based on the telemetry data.
 *
 * Uses the raw joint angles to calculate the path of the wheels (rather than the translation/rotation of the AGV in cartesian space).
 *
 * Only works when telemetry is enabled in GBC and being captured by GBR (via Telemetry tile).
 */
export const AgvTracks = () => {
    const config = useConfig()
    const kc = config.kinematicsConfiguration[AGV_KC_INDEX]
    const wheels = kc?.agvWheels || []

    const { data, count, firstTimecode } = useTelemetryData()
    // initial joint positions for the driving joints, on which deltas are applied
    const [drivingJointInitialPositions, setDrivingJointInitialPositions] = React.useState(
        wheels.map(() => 0)
    )
    // path of each wheel from start of telemetry capture
    const [paths, setPaths] = React.useState(wheels.map(() => []))

    // runs when telemetry capture is started, and sets the initial driving joint positions
    useEffect(() => {
        const telemetry = Array.from(data([0]))
        if (telemetry[0]) {
            setDrivingJointInitialPositions(
                wheels.map((_, i) => {
                    const logical_joint = i + wheels.length
                    const joint_num = kc.participatingJoints[logical_joint]
                    return telemetry[0].set[joint_num].p
                })
            )
        }
    }, [firstTimecode])

    // runs when new telemetry data is received, and calculates the next position of each wheel
    useEffect(() => {
        const telemetry = Array.from(data([0]))
        const new_paths = wheels.map(() => [])

        for (const [index, t] of telemetry.entries()) {
            const { q } = t // rotation data
            const arr = q[AGV_KC_INDEX] // first kc
            const quat = new Quaternion().fromArray(arr)
            const euler = new Euler().setFromQuaternion(quat)

            // heading of the AGV
            const heading = euler.z

            for (const [wheel_index, w] of wheels.entries()) {
                const logical_steering_joint = wheel_index
                const logical_driving_joint = wheel_index + wheels.length

                const steering_joint = kc.participatingJoints[logical_steering_joint]
                const driving_joint = kc.participatingJoints[logical_driving_joint]

                // steering angle
                const steering_angle = t.set[steering_joint].p + heading

                // driving angle (previous and current)
                const prev =
                    index > 0
                        ? telemetry[index - 1].set[driving_joint].p
                        : drivingJointInitialPositions[wheel_index]

                const current = t.set[driving_joint].p

                // we want to apply delta to the previous position of the wheel, or the initial position if this is the first telemetry data
                const prev_position =
                    index > 0 ? new_paths[wheel_index][index - 1] : [w.position.x, w.position.y, 0]

                const delta = [
                    Math.cos(steering_angle) * (current - prev) * w.radius,
                    Math.sin(steering_angle) * (current - prev) * w.radius
                ]
                // add the delta to the previous position to get the new position
                new_paths[wheel_index].push([
                    prev_position[0] + delta[0],
                    prev_position[1] + delta[1],
                    0
                ])
            }
        }
        setPaths(new_paths)
    }, [count])

    if (!wheels?.length) {
        return null
    }

    return (
        <group scale={100}>
            {wheels.map(
                (_w, index) =>
                    paths?.[index].length > 0 && (
                        <Line key={index} points={paths[index]} color="red" lineWidth={1} />
                    )
            )}
        </group>
    )
}
