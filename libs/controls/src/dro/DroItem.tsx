import { GlobalStyles } from "../misc/GlobalStyles"
import { usePrefs } from "@glowbuzzer/store"
import { ConversionFactors } from "../util/unit_conversion"
import { Col, Row } from "antd"
import { SegmentDisplay } from "./SegmentDisplay"
import * as React from "react"

const styles = {
    ...GlobalStyles,
    dro: {
        marginTop: "6px"
    }
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
