import { GlobalStyles } from "../misc/GlobalStyles"
import { usePrefs } from "@glowbuzzer/store"
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
    type: "linear" | "angular"

    /**
     * Whether the value is in error (shown in a different colour)
     */
    error?: boolean
}

/**
 * Displays a single DRO item with label and optional error state.
 */
export const DroItem = ({ label, value, type, error }: DroItemProps) => {
    const prefs = usePrefs()

    return (
        <Row gutter={0}>
            <Col style={styles.label}>{label}</Col>
            <Col style={styles.dro}>
                <SegmentDisplay
                    value={prefs.fromSI(value, type)}
                    toFixed={4}
                    width={12}
                    error={error}
                />
                {prefs.getUnits(type)}
            </Col>
        </Row>
    )
}
