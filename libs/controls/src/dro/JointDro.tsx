import * as React from "react"
import { CSSProperties } from "react"
import { Col, Row, Slider } from "antd"
import { SegmentDisplay } from "./SegmentDisplay"
import { GlobalStyles } from "../misc/GlobalStyles"
import { ConversionFactors } from "../util/unit_conversion"
import {
    JOINT_FINITECONTINUOUS,
    JOINT_TYPE,
    useJoint,
    useJointConfig,
    useJointCount,
    usePrefs
} from "@glowbuzzer/store"
import { Tile } from "../tiles"
import styled from "styled-components"

// const DisplayValue = ({ value }: { value: number }) => {
//     if (isNaN(value)) {
//         return <>{value.toString()}</>
//     }
//
//     return <>{value.toPrecision(4)}</>
// }

const StyledRow = styled(Row)`
    .slider-wrapper {
        margin-left: 20px;
        padding-top: 10px;
        display: flex;
        align-items: center;
        gap: 5px;

        .ant-slider {
            flex-grow: 1;
        }
    }
`

const minmaxStyle: CSSProperties = {
    display: "inline-block",
    width: "50px",
    overflowX: "hidden",
    whiteSpace: "nowrap",
    transform: "translateY(4px)"
}

// TODO: convert to styled-components
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

const JointDroItem = ({ index, warningThreshold }) => {
    const prefs = usePrefs()
    const j = useJoint(index)
    const config = useJointConfig()[index]

    const { name, finiteContinuous, negLimit, posLimit, jointType } = config
    const { actPos } = j
    const showSlider = finiteContinuous === JOINT_FINITECONTINUOUS.JOINT_FINITE
    const type = jointType === JOINT_TYPE.JOINT_REVOLUTE ? "units_angular" : "units_scalar"

    const units = prefs.current[type]
    const min = negLimit * ConversionFactors[units]
    const max = posLimit * ConversionFactors[units]
    const current = actPos * ConversionFactors[units]
    const warn_range = (posLimit - negLimit) * warningThreshold
    const warn =
        warn_range > 0 && (current < negLimit + warn_range || current > posLimit - warn_range)
    // const progress = (current / (max - min)) * 100

    return (
        <StyledRow key={index}>
            <Col style={styles.label}>{name}</Col>
            <Col style={styles.dro}>
                <SegmentDisplay value={current} toFixed={4} width={12} error={warn} />
                {units}
            </Col>
            <Col flex={"auto"}>
                {showSlider && (
                    <div className="slider-wrapper">
                        {min.toPrecision(4)}
                        <Slider
                            min={min}
                            max={max}
                            disabled
                            value={j?.actPos}
                            tooltipVisible={false}
                        />
                        {max.toPrecision(4)}
                    </div>
                )}
            </Col>
        </StyledRow>
    )
}

export const JointDro = ({
    jointsToDisplay,
    warningThreshold
}: {
    jointsToDisplay?: number[]
    warningThreshold: number
}) => {
    // const joint_config = useJointConfig()
    const count = useJointCount()

    return (
        <div>
            {Array.from({ length: count })
                .filter((_, index) => !jointsToDisplay || jointsToDisplay.includes(index))
                .map((_, index) => (
                    <JointDroItem key={index} index={index} warningThreshold={warningThreshold} />
                ))}
        </div>
    )
}

export const JointDroTile = () => {
    return (
        <Tile title="Joint DRO">
            <JointDro warningThreshold={0.05} />
        </Tile>
    )
}
