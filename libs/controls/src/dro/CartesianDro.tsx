import * as React from "react"
import { Col, Row } from "antd"
import { FrameSelector } from "../misc/FrameSelector"
import { useKinematics, usePrefs } from "@glowbuzzer/store"
import { SegmentDisplay } from "./SegmentDisplay"
import { ConversionFactors } from "../util/unit_conversion"
import * as THREE from "three"
import { GlobalStyles } from "../misc/GlobalStyles"

type CartesianDisplayProps = {
    /**
     * The index of the kinematics configuration in the current configuration.
     */
    kinematicsConfigurationIndex: number

    /**
     * Hide frame selection control. If `true`, values will be displayed in local coordinates.
     */
    hideFrameSelect?: boolean

    /**
     * Optional comma-separated list of axes to display
     */
    select?: string
}

const styles = {
    ...GlobalStyles,
    dro: {
        marginTop: "6px"
    }
}

const types = {
    x: "scalar",
    y: "scalar",
    z: "scalar",
    a: "angular",
    b: "angular",
    c: "angular"
}

type DroItemProps = {
    /**
     * The label for this DRO item
     */
    label: string
    /**
     * The current value in standard units (millimeters or radians)
     */
    value: number
    /**
     * Whether the value is scalar or angular. This affects automatic unit conversion according to preferences.
     */
    type: "scalar" | "angular"
}

export const DroItem = ({ label, value, type }: DroItemProps) => {
    const prefs = usePrefs()
    const units = "units_" + type

    function convert(k, v) {
        return v * ConversionFactors[prefs.current[units]]
    }

    return (
        <Row gutter={0}>
            <Col style={styles.label}>{label.toUpperCase()}</Col>
            <Col style={styles.dro}>
                <SegmentDisplay value={convert(label, value)} />
                {prefs.current[units]}
            </Col>
        </Row>
    )
}

export const CartesianDro = (props: CartesianDisplayProps) => {
    const [frameIndex, setFrameIndex] = React.useState<number>(0)
    const kinematics = useKinematics(0, frameIndex)

    const { position, orientation } = kinematics.pose

    const euler = new THREE.Euler().setFromQuaternion(orientation)

    const pos = {
        x: position.x,
        y: position.y,
        z: position.z,
        a: euler.x,
        b: euler.y,
        c: euler.z
    }

    const display = props.select ? props.select.split(",").map(s => s.trim()) : Object.keys(pos)

    console.log("FRAME INDEX", frameIndex)

    return (
        <div>
            {props.hideFrameSelect || (
                <div>
                    Frame: <FrameSelector defaultFrame={kinematics.frameIndex} onChange={setFrameIndex} />
                </div>
            )}
            {display.map(k => (
                <DroItem key={k} label={k} value={pos[k]} type={types[k]} />
            ))}
        </div>
    )
}
