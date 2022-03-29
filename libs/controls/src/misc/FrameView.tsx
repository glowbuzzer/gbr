// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from "react"
import { useFrames, usePrefs } from "@glowbuzzer/store"
import { Euler, Quaternion } from "three"
import { Checkbox, Col, Radio, Row, Table } from "antd"
import { RadioChangeEvent } from "antd/es/radio"

enum AngleType {
    QUATERNION,
    EULER
}

type DiplayNumProps = {
    value: number
    precision?: number
    width?: number
    type?: "scalar" | "angular" | "generic"
}

const DisplayNumList = (props: Omit<DiplayNumProps, "value"> & { values: number[] }) => {
    const { values, ...other } = props
    return (
        <span>
            {values.map((v, index) => (
                <DisplayNum key={index} value={v} {...other} />
            ))}
        </span>
    )
}

const DisplayNum = ({ value, precision, width, type }: DiplayNumProps) => {
    const prefs = usePrefs()

    const props = width
        ? {
              style: {
                  width: width + "px",
                  display: "inline-block",
                  textAlign: "right",
                  paddingRight: "5px"
              }
          }
        : {}

    if (isNaN(value)) {
        // this is a fallback in case string value / undefined is passed
        return <span {...props}>{value}</span>
    }
    if (value * value < 0.000000001) {
        return <span {...props}>0</span>
    }

    const factors = {
        mm: 1,
        in: 0.254,
        rad: 1,
        deg: 180 / Math.PI
    }

    function convert_value() {
        switch (type) {
            case "scalar":
                return value * factors[prefs.current.units_scalar]
            case "angular":
                return value * factors[prefs.current.units_angular]
            case "generic":
            default:
                return value
        }
    }

    // do conversion
    const converted = convert_value()

    return <span {...props}>{converted.toPrecision(precision || 3)}</span>
}

export const FrameView = () => {
    const [angleType, setAngleType] = React.useState(AngleType.QUATERNION)
    const [absRel, setAbsRel] = React.useState(1)
    const frameConfig = useFrames()

    function renderAngles(r: Quaternion) {
        if (angleType === AngleType.QUATERNION) {
            return <DisplayNumList type="generic" values={[r.x, r.y, r.z, r.w]} width={40} />
        }
        const e = new Euler().setFromQuaternion(r)
        return <DisplayNumList type="angular" values={[e.x, e.y, e.z]} width={40} />
    }

    const rows = frameConfig.asList.map(item => {
        const frame = absRel ? item.relative : item.absolute
        const t = frame.translation
        const r = frame.rotation
        const indent = item.level * 10 + "px"
        return {
            key: item.index,
            title: <div style={{ marginLeft: indent }}>{item.text}</div>,
            translation: <DisplayNumList type="scalar" values={[t.x, t.y, t.z]} width={40} />,
            rotation: renderAngles(r)
        }
    })

    function handleChange(e: RadioChangeEvent) {
        setAngleType(e.target.value)
    }

    function toggle() {
        setAbsRel(v => 1 - v)
    }

    return (
        <div>
            <Row>
                <Col>
                    <Checkbox checked={absRel > 0} onChange={toggle}>
                        Show Relative
                    </Checkbox>
                </Col>
                <Radio.Group value={angleType} onChange={handleChange}>
                    <Radio value={AngleType.QUATERNION}>Quaternion</Radio>
                    <Radio value={AngleType.EULER}>Euler</Radio>
                </Radio.Group>
            </Row>
            <Table dataSource={rows} pagination={false} showHeader={false} size={"small"}>
                <Table.Column title="Name" dataIndex="title" />
                <Table.Column title="Translation" dataIndex="translation" />
                <Table.Column title="Rotation" dataIndex="rotation" />
            </Table>
        </div>
    )
}
