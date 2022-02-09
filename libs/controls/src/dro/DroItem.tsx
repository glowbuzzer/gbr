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

    /**
     * Whether the value is in error (shown in a different colour)
     */
    error?: boolean
}
export const DroItem = ({ label, value, type, error }: DroItemProps) => {
    const prefs = usePrefs()
    const units = "units_" + type

    function convert(k, v) {
        return v * ConversionFactors[prefs.current[units]]
    }

    return (
        <Row gutter={0}>
            <Col style={styles.label}>{label}</Col>
            <Col style={styles.dro}>
                <SegmentDisplay
                    value={convert(label, value)}
                    toFixed={4}
                    width={12}
                    error={error}
                />
                {prefs.current[units]}
            </Col>
        </Row>
    )
}
