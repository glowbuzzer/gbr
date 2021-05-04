import * as React from "react"
import { Col, Row } from "antd"
import { SegmentDisplay } from "./SegmentDisplay"
import { GlobalStyles } from "../misc/GlobalStyles"
import { ConversionFactors } from "../util/unit_conversion"
import { useJointConfig, usePrefs } from "@glowbuzzer/store"
import { useJoints } from "@glowbuzzer/store"
import { CSSProperties } from "react"

const DisplayValue = ({ value }: { value: number }) => {
    if (isNaN(value)) {
        return <>{value}</>
    }

    return <>{value.toPrecision(4)}</>
}

type JointDroProps = {
    /**
     * Joints to display. This is a dictionary with joint number as key and label as value. If not provided all
     * joints will be displayed with joint number as label.
     */
    joints?: { [index: number]: string }
}

export const JointDro = ({ joints: jointMapping }: JointDroProps) => {
    const prefs = usePrefs()

    const joint_config = useJointConfig()
    const joints = useJoints().map((j, i) => ({
        ...j,
        ...joint_config[i]
    }))

    const minmaxStyle: CSSProperties = {
        display: "inline-block",
        width: "50px",
        overflowX: "hidden",
        whiteSpace: "nowrap",
        transform: "translateY(4px)"
    }
    const styles: { [key: string]: CSSProperties } = {
        ...GlobalStyles,
        min: {
            ...minmaxStyle,
            textAlign: "right",
            marginLeft: "10px",
            marginRight: "10px"
        },
        max: {
            ...minmaxStyle,
            marginLeft: "10px"
        },
        slider: {
            display: "inline-block",
            cursor: "default",
            width: "200px",
            margin: "0"
        },
        middle: {
            width: "350px",
            transform: "translateY(1px)"
        },
        leftDot: {
            left: "0%"
        },
        rightDot: {
            left: "100%"
        },
        markTextLeft: {
            cursor: "default",
            left: "0%"
            // transform: "translateX(-120%) translateY(-90%)",
        },
        markTextRight: {
            cursor: "default",
            left: "100%"
            // transform: "translateX(20%) translateY(-90%)",
        },
        handle: {
            cursor: "default",
            right: "auto"
            // transform: "translateX(-50%)"
        }
    }

    const joints_to_display = jointMapping
        ? Object.keys(jointMapping).map(k => ({
              ...joints[k],
              name: jointMapping[k]
          }))
        : joints

    return (
        <div>
            {joints_to_display.map((j, index) => {
                const { name, jointType, finiteContinuous, negLimit, posLimit, actPos } = j
                const showSlider = !finiteContinuous
                const type = jointType ? "units_scalar" : "units_angular"

                const units = prefs.current[type]
                const min = negLimit * ConversionFactors[units]
                const max = posLimit * ConversionFactors[units]
                const current = actPos * ConversionFactors[units]
                const progress = (current / (max - min)) * 100

                return (
                    <Row key={index}>
                        <Col style={styles.label}>{name}</Col>
                        <Col style={styles.middle}>
                            {showSlider && (
                                <>
                                    <div style={styles.min}>
                                        <DisplayValue value={min} />
                                    </div>
                                    <div className="ant-slider" style={styles.slider}>
                                        <div className="ant-slider-rail" />

                                        <div className="ant-slider-step">
                                            <span className="ant-slider-dot" style={styles.leftDot} />
                                            <span className="ant-slider-dot" style={styles.rightDot} />
                                        </div>

                                        <div className="ant-slider-handle" style={{ ...styles.handle, left: progress + "%" }} />
                                    </div>
                                    <div style={styles.max}>
                                        <DisplayValue value={max} />
                                    </div>
                                </>
                            )}
                        </Col>
                        <Col style={styles.dro}>
                            <SegmentDisplay value={current} />
                            {units}
                        </Col>
                    </Row>
                )
            })}
        </div>
    )
}
