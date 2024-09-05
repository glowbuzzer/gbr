import React, { useState } from "react"
import { Button, Card, Col, Row, Select, Slider, Table, Typography } from "antd"

const { Option } = Select
const { Text } = Typography

enum DriveType {
    UNKNOWN_DRIVE = "UNKNOWN_DRIVE",
    SYNAPTICON_DRIVE = "SYNAPTICON_DRIVE",
    ELM7813_DRIVE = "ELM7813_DRIVE"
}

interface DriveParameters {
    Kp: number
    Ki: number
    Kd: number
    intLimit: number
}

interface Drive {
    index: number
    type: DriveType
    dampingRatio: number
    settlingTime: number
    positionControl: DriveParameters
    velocityControl: DriveParameters
}

interface DrivesData {
    drives: Drive[]
}

const data: DrivesData = {
    drives: [
        {
            index: 1,
            type: DriveType.SYNAPTICON_DRIVE,
            dampingRatio: 0.5,
            settlingTime: 1.2,
            positionControl: {
                Kp: 0,
                Ki: 0,
                Kd: 0,
                intLimit: 0
            },
            velocityControl: {
                Kp: 0,
                Ki: 0,
                Kd: 0,
                intLimit: 0
            }
        }
        // Add more drives as needed
    ]
}

const columns = [
    {
        title: "Parameter",
        dataIndex: "parameter",
        key: "parameter"
    },
    {
        title: "Position Control",
        dataIndex: "positionControl",
        key: "positionControl"
    },
    {
        title: "Velocity Control",
        dataIndex: "velocityControl",
        key: "velocityControl"
    }
]

export const DriveConfigTab: React.FC<{}> = () => {
    const [selectedDriveIndex, setSelectedDriveIndex] = useState<number | null>(null)
    const [drives, setDrives] = useState<Drive[]>(data.drives)

    const handleDriveChange = (value: number) => {
        setSelectedDriveIndex(value)
    }

    const handleSliderChange = (
        index: number,
        value: number,
        key: "dampingRatio" | "settlingTime"
    ) => {
        const updatedDrives = drives.map(drive =>
            drive.index === index
                ? { ...drive, [key]: value, ...calculateDriveParameters(value, key, drive) }
                : drive
        )
        setDrives(updatedDrives)
    }

    const calculateDriveParameters = (
        value: number,
        key: "dampingRatio" | "settlingTime",
        drive: Drive
    ) => {
        // Implement your algorithm to calculate Kp, Ki, Kd, intLimit based on dampingRatio and settlingTime
        const calculatedValues = {
            positionControl: { Kp: value * 2, Ki: value * 3, Kd: value * 4, intLimit: value * 5 },
            velocityControl: { Kp: value * 6, Ki: value * 7, Kd: value * 8, intLimit: value * 9 }
        } // Placeholder for actual calculation logic
        return calculatedValues
    }

    const driveCounts = drives.reduce(
        (counts, drive) => {
            counts[drive.type] = (counts[drive.type] || 0) + 1
            return counts
        },
        {} as Record<DriveType, number>
    )

    const selectedDrive = drives.find(drive => drive.index === selectedDriveIndex)

    const dataSource = selectedDrive
        ? [
              {
                  key: "1",
                  parameter: "Kp",
                  positionControl: selectedDrive.positionControl.Kp,
                  velocityControl: selectedDrive.velocityControl.Kp
              },
              {
                  key: "2",
                  parameter: "Ki",
                  positionControl: selectedDrive.positionControl.Ki,
                  velocityControl: selectedDrive.velocityControl.Ki
              },
              {
                  key: "3",
                  parameter: "Kd",
                  positionControl: selectedDrive.positionControl.Kd,
                  velocityControl: selectedDrive.velocityControl.Kd
              },
              {
                  key: "4",
                  parameter: "Integral Limit",
                  positionControl: selectedDrive.positionControl.intLimit,
                  velocityControl: selectedDrive.velocityControl.intLimit
              }
          ]
        : []

    return (
        <div>
            <Text>
                Your machine contains {driveCounts[DriveType.SYNAPTICON_DRIVE] || 0} Synapticon
                drives and {driveCounts[DriveType.ELM7813_DRIVE] || 0} Beckhoff drives.
            </Text>
            <br />
            <br />
            <Text>First, you need to select a drive that you want to configure:</Text>
            <br />
            <br />
            <Select
                placeholder="Select a drive to configure"
                onChange={handleDriveChange}
                size={"small"}
                style={{ width: 300 }}
            >
                {drives.map(drive => (
                    <Option key={drive.index} value={drive.index}>
                        {`Index: ${drive.index}, Type: ${drive.type}`}
                    </Option>
                ))}
            </Select>
            <br />
            <br />
            <Text>Now, read the current drive values:</Text>
            <br />
            <br />
            <Button type="primary" size={"small"}>
                Read parameters
            </Button>

            {selectedDriveIndex !== null && selectedDrive && (
                <div>
                    <Card
                        title={`Damping Ratio: ${selectedDrive.dampingRatio.toFixed(2)}`}
                        style={{ marginTop: 16 }}
                        size={"small"}
                    >
                        <Row>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Text>0.3</Text>
                            </Col>
                            <Col span={16}>
                                <Slider
                                    min={0.3}
                                    max={2}
                                    step={0.01}
                                    value={selectedDrive.dampingRatio}
                                    onChange={(value: number) =>
                                        handleSliderChange(
                                            selectedDriveIndex,
                                            value,
                                            "dampingRatio"
                                        )
                                    }
                                />
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Text>2.0</Text>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        title={`Settling Time: ${(selectedDrive.settlingTime * 1000).toFixed(
                            1
                        )} ms`}
                        style={{ marginTop: 16 }}
                        size={"small"}
                    >
                        <Row>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Text>20 ms</Text>
                            </Col>
                            <Col span={16}>
                                <Slider
                                    min={0.02}
                                    max={0.5}
                                    step={0.001}
                                    value={selectedDrive.settlingTime}
                                    onChange={(value: number) =>
                                        handleSliderChange(
                                            selectedDriveIndex,
                                            value,
                                            "settlingTime"
                                        )
                                    }
                                />
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Text>500 ms</Text>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Calculated Parameters" style={{ marginTop: 16 }}>
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            bordered
                        />
                    </Card>
                </div>
            )}
            <br />
            <br />
            <Text>Finally, write the drive values to update them:</Text>
            <br />
            <br />
            <Button type="primary" size={"small"}>
                Write parameters
            </Button>
        </div>
    )
}
