import React, { useEffect, useState, createRef } from "react"

import styled from "styled-components"
import { Row, Col, Divider, PageHeader, Card, Tree, Slider, Tooltip, Button, InputNumber, Typography, Alert, message, Space } from "antd"
import { ThunderboltFilled } from "@ant-design/icons"
import { BitFieldDisplay } from "@glowbuzzer/controls"
import "antd/dist/antd.css"
import "./app.css"
import ClipLoader from "react-spinners/ClipLoader"
import axios from "axios"

import { slaveStateTable, alTable } from "./lookups"
import { isNull, isNullOrUndefined } from "util"
import { IconType } from "rc-tree/lib/interface"

const style = { background: "#ffffff", padding: "8px 8px" }

const { Text, Link } = Typography

const StyledApp = styled.div`
    header {
        font-size: 2em;
    }
    .name {
        font-size: 1.5em;
    }
    .url {
    }
`

const StatusFreqTable = styled.div`
    // display: flex;
    width: 500px;
    // gap: 30px;
    // padding: 20px;
    // align-items: space-around;
    align-items: centre;
    .ant-slider {
        flex-grow: 2;
        // flex-wrap: no-wrap;
        margin: 20px 40px;
    }
`

//AK - This is the interface for antd tree data node - should i reuse the one from node_modules/rc-tree/lib/interface.d.ts? if so i can't work out the import syntax
interface DataNode {
    title: string
    key: string
    isLeaf?: boolean
    className?: string
    icon?: IconType
    children?: DataNode[]
}

const ShowTree = ({ dataObject }: { dataObject: any }) => {
    return <Tree showIcon treeData={dataObject} />
}

//AK this is a bit odd - i use for the arrays of int ins etc.
interface numVal {
    num: number
    val: number
}

//AK It is a shame these end up with quite a bit of format stuff in them
const ShowListNoNums = ({ dataObject }: { dataObject: any }) => {
    console.log("is this empty (no num)?" + dataObject)
    if (dataObject.length != 0) {
        return (
            <div>
                {dataObject.map(numVal => (
                    <div style={{ textIndent: "50px" }}>
                        <Text code>{numVal.val}</Text>
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div style={{ textIndent: "50px" }}>
            <Text code>None</Text>
        </div>
    )
}

const ShowListNums = ({ dataObject }: { dataObject: any }) => {
    console.log("is this empty (num)?" + dataObject)
    if (dataObject.length != 0) {
        return (
            <div>
                {dataObject.map(numVal => (
                    <div style={{ textIndent: "50px" }}>
                        {" "}
                        {numVal.num} <Text code>{numVal.val}</Text>
                    </div>
                ))}
            </div>
        )
    }
    console.log("here")
    return (
        <div style={{ textIndent: "50px" }}>
            <Text code>None</Text>
        </div>
    )
}

// function HasPickedUpEmstatFiles(props) {
//     const hasFiles = props.hasFiles;
//     if (hasFiles) {
//         return <h1>Has picked up files</h1>;
//     }
//     return <h1>Waiting to connect to GBC to pick up status...</h1>;
// }

function ConnectionStatus() {
    switch (connectionState) {
        case conState.noError: {
            return null
        }
        case conState.noResponseFromGBC: {
            return <Alert message="GBC did not reply to GET request for the Status JSON file" type="error" />
        }
        case conState.errorResponseFromGBC: {
            return <Alert message="GBC replied with an error response to the GET request for the Status JSON file" type="error" />
        }
        case conState.unknownConnectionError: {
            return <Alert message="An unknown error occurred requesting the Status JSON file from GBC" type="error" />
        }
    }
}

enum conState {
    noError,
    noResponseFromGBC,
    errorResponseFromGBC,
    unknownConnectionError
}

let connectionState = conState.noError

//AK shame i have these warnings 'Element' is not assignable to type 'string' in here
function makeDriveTree(statusJSON: any, constJSON: any) {
    const driveTree: DataNode[] = []
    let keyCount = 0

    // console.log("statusJSON:" + JSON.stringify(statusJSON));

    for (let i = 0; i < constJSON?.number_of_drives; i++) {
        driveTree.push({ title: constJSON?.drives[i].name, key: "" + keyCount++ })

        driveTree[i].children = new Array()

        if (!statusJSON?.drives[i].error_message) {
            driveTree[i].children.push({
                title: (
                    <span>
                        Alarm: <Text code>none</Text>
                    </span>
                ),
                key: "" + keyCount++
            })
        } else {
            driveTree[i].children.push({
                title: (
                    <span>
                        Alarm: <Text code>{statusJSON?.drives[i].error_message}</Text>
                    </span>
                ),
                key: "" + keyCount++
            })
        }
        driveTree[i].children.push({
            title: (
                <span>
                    Actual position: <Text code>{statusJSON?.drives[i].actpos.toLocaleString()}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        driveTree[i].children.push({
            title: (
                <span>
                    Set position: <Text code>{statusJSON?.drives[i].setpos.toLocaleString()}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        driveTree[i].children.push({
            title: (
                <span>
                    Command (CiA 402): <Text code>{statusJSON?.drives[i].command}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        driveTree[i].children.push({
            title: (
                <span>
                    Status (CiA 402): <Text code>{statusJSON?.drives[i].status}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
    }
    return driveTree
}

function makeSlaveTree(statusJSON: any, constJSON: any) {
    const slaveTree: DataNode[] = []
    const alMapper = al => alTable[al] || "No alarm"
    const slaveStateMapper = slaveState => slaveStateTable[slaveState] || "No state"
    let keyCount = 0

    // console.log("statusJSON:" + JSON.stringify(statusJSON));

    for (let i = 0; i < constJSON?.number_of_slaves; i++) {
        slaveTree.push({ title: constJSON?.slaves[i].name, key: "" + keyCount++ })
        slaveTree[i].children = new Array()

        slaveTree[i].children.push({
            title: (
                <span>
                    Number (position on network): <Text code>{constJSON?.slaves[i].number}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Address: <Text code>0x{constJSON?.slaves[i].address.toString(16)}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    State (EtherCAT state machine): <Text code>{slaveStateMapper(statusJSON?.slaves[i].state)}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Has DC?: <Text code>{constJSON?.slaves[i].hasDC ? "true" : "false"}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Number of OUTPUT bits: <Text code>{constJSON?.slaves[i].Obits}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Number of INPUT bits: <Text code>{constJSON?.slaves[i].Ibits}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Number of OUTPUT bytes: <Text code>{constJSON?.slaves[i].Obytes}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    Number of INPUT bytes: <Text code>{constJSON?.slaves[i].Ibytes}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
        slaveTree[i].children.push({
            title: (
                <span>
                    AL status: <Text code>{alMapper(statusJSON?.slaves[i].ALstatuscode)}</Text>
                </span>
            ),
            key: "" + keyCount++
        })
    }
    return slaveTree
}

export const App = () => {
    const statusFrequency = 50
    const [frequency, setFrequency] = useState(statusFrequency)
    const [emstat_const_result, emstat_const_setResult] = useState(null)
    const [emstat_status_result, emstat_status_setResult] = useState(null)

    let slaveTreeData: DataNode[] = []
    let driveTreeData: DataNode[] = []
    const int_ins: numVal[] = []
    const int_outs: numVal[] = []
    const float_ins: numVal[] = []
    const float_outs: numVal[] = []

    const slaveErrors: numVal[] = []

    let hascon = false
    if (emstat_const_result != null && emstat_status_result != null) {
        hascon = true

        for (let i = 0; i < emstat_const_result.number_of_integer_ins; i++) {
            int_ins.push({ num: i, val: emstat_status_result?.int_in[i] })
        }

        for (let i = 0; i < emstat_const_result.number_of_integer_outs; i++) {
            int_outs.push({ num: i, val: emstat_status_result?.int_out[i] })
        }

        for (let i = 0; i < emstat_const_result.number_of_float_ins; i++) {
            float_ins.push({ num: i, val: emstat_status_result?.float_in[i] })
        }

        for (let i = 0; i < emstat_const_result.number_of_float_outs; i++) {
            float_outs.push({ num: i, val: emstat_status_result?.float_out[i] })
        }

        for (let i = 0; i < Object.keys(emstat_status_result?.slave_errors).length; i++) {
            slaveErrors.push({ num: i, val: emstat_status_result?.slave_errors[i] })
        }

        slaveTreeData = makeSlaveTree(emstat_status_result, emstat_const_result)
        driveTreeData = makeDriveTree(emstat_status_result, emstat_const_result)
    }

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setFrequency(statusFrequency)
    }, [statusFrequency])

    //Need to decide where the connection url comes from. emstat isnt really any use without some sort of gb front end running so be a shame to enter it twice

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLoading(true)
            axios
                .get("http://rpi-dghome:9001/emstat/emstat_status.json")
                .then(json => {
                    emstat_status_setResult(json.data)
                    setIsLoading(false)
                    connectionState = conState.noError
                })
                .catch(e => {
                    if (e.response) {
                        // The request was made and the server responded with a status code that falls out of the range of 2xx
                        console.log("response received: " + e.response.data + ".data")
                        console.log("response received: " + e.response.status + ".status")
                        connectionState = conState.errorResponseFromGBC
                    } else if (e.request) {
                        // The request was made but no response was received error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
                        console.log("no response received: " + e.request + "(.request")
                        connectionState = conState.noResponseFromGBC
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log("Somthing else error: ", e.message + "(.message)")
                        connectionState = conState.unknownConnectionError
                    }
                    console.log("config: " + e.config)
                    setIsLoading(false)
                })
        }, 10000 - frequency * 90)
        return () => clearInterval(interval)
    }, [frequency])

    useEffect(() => {
        axios.get("http://rpi-dghome:9001/emstat/emstat_const.json").then(json => emstat_const_setResult(json.data))
    }, [])

    return (
        <StyledApp>
            <main>
                <PageHeader
                    className="site-page-header"
                    title="emstat"
                    subTitle="EtherCAT master status view"
                    extra={[<ClipLoader color="#000000" loading={!hascon} size={30} />]}
                />
                ,
                <ConnectionStatus />
                <Card title="Machine status">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={11}>
                            <div>
                                <span>
                                    <h4>Overall machine status</h4>
                                </span>
                            </div>

                            <div>
                                <span>
                                    Machine status word: <Text code>{emstat_status_result?.machine_status_word}</Text>
                                </span>
                            </div>
                            <div>
                                <span>
                                    Machine control word (CiA 402): <Text code>{emstat_status_result?.machine_control_word}</Text>
                                </span>
                            </div>
                            <div>
                                <span>
                                    Shared memory connection established: <Text code>{emstat_status_result?.gbc_connected}</Text>{" "}
                                </span>
                            </div>
                            <div>
                                <Tooltip placement="top" title="Heartbeat IN is generated by GBEM and is sent to GBC">
                                    Heartbeat IN:{" "}
                                    <span>
                                        <Text code> {emstat_status_result?.heartbeat_in} </Text>
                                    </span>
                                </Tooltip>
                            </div>
                            <div>
                                <Tooltip
                                    placement="bottom"
                                    title="Heartbeat OUT is the echo of the heartbeat sent to GBEM from GBC. It is only echoed once GBC connects to the HLC"
                                >
                                    Heartbeat OUT: <Text code>{emstat_status_result?.heartbeat_out}</Text>
                                </Tooltip>
                            </div>
                            <div>
                                <span>
                                    EtherCAT error: <Text code>{emstat_status_result?.ecat_error}</Text>
                                </span>
                            </div>
                            <div>
                                <Tooltip
                                    placement="bottom"
                                    title="Slave errors are error messages generated by the slaves and received by the EtherCAT master"
                                >
                                    <span>Slave errors:</span>
                                </Tooltip>
                            </div>
                            <ShowListNoNums dataObject={slaveErrors} />
                        </Col>

                        <Col className="gutter-row" span={11}>
                            <Tooltip placement="left" title="Shows faults currently active on the machine">
                                <p>
                                    <h4>Machine active faults</h4>
                                </p>
                            </Tooltip>

                            <BitFieldDisplay
                                bitCount={13}
                                value={emstat_status_result?.machine_active_faults}
                                labels={[
                                    "ESTOP",
                                    "DRIVE FAULT",
                                    "GBC FAULT REQUEST",
                                    "HEARTBEAT LOST",
                                    "LIMIT REACHED",
                                    "DRIVE STATE CHANGE TIMEOUT",
                                    "DRIVE FOLLOW ERROR",
                                    "DRIVE NO REMOTE",
                                    "ECAT",
                                    "DRIVE_ALARM",
                                    "GBC T _PLC CON ERROR",
                                    "DRIVE MOOERROR",
                                    "ECAT SLAVE ERROR"
                                ]}
                            />

                            <Tooltip
                                placement="left"
                                title="Shows the fault that was active when the machine first entered the fault reaction active state"
                            >
                                <div>
                                    <h4>Machine fault history</h4>
                                </div>
                            </Tooltip>
                            <BitFieldDisplay
                                bitCount={13}
                                value={emstat_status_result?.machine_historic_faults}
                                labels={[
                                    "ESTOP",
                                    "DRIVE FAULT",
                                    "GBC FAULT REQUEST",
                                    "HEARTBEAT LOST",
                                    "LIMIT REACHED",
                                    "DRIVE STATE CHANGE TIMEOUT",
                                    "DRIVE FOLLOW ERROR",
                                    "DRIVE NO REMOTE",
                                    "ECAT",
                                    "DRIVE_ALARM",
                                    "GBC TO PLC CON_ERROR",
                                    "DRIVE MOOERROR",
                                    "ECAT SLAVE ERROR"
                                ]}
                            />
                        </Col>
                    </Row>
                </Card>
                {/*<Divider orientation="left">Slave & Drive status</Divider>*/}
                <Card title="Slave & Drive status">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={11}>
                            <div style={style}>
                                <h4>EtherCAT slave status</h4>
                            </div>
                            <div style={style}>Number of slaves found on EtherCAT network: {emstat_const_result?.number_of_slaves}</div>
                        </Col>
                        <Col className="gutter-row" span={11}>
                            <div style={style}>
                                <h4>Drive status</h4>
                            </div>
                            <div style={style}>Number of drives found on EtherCAT network: {emstat_const_result?.number_of_drives}</div>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={11}>
                            <div style={style}>
                                <ShowTree dataObject={slaveTreeData} />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={11}>
                            <div style={style}>
                                <ShowTree dataObject={driveTreeData} />
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Card title="Digital Analogue Integer in/out status">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={11}>
                            <div>
                                <h4>Digital IN</h4>
                            </div>
                            <div>
                                Number of Digital Ins defined in GBEM <Text underline>MAP_NUM_DIGITAL_IN</Text> is:{" "}
                                {emstat_const_result?.number_of_digital_ins}
                            </div>
                            <BitFieldDisplay bitCount={32} value={emstat_status_result?.din_lower32} />
                            <BitFieldDisplay bitCount={32} value={emstat_status_result?.din_upper32} />
                            <div>
                                <h4>Digital OUT</h4>
                            </div>
                            <div>
                                Number of Digital Outs defined in GBEM <Text underline>MAP_NUM_DIGITAL_OUT</Text> is:{" "}
                                {emstat_const_result?.number_of_digital_outs}
                            </div>
                            <BitFieldDisplay bitCount={32} value={emstat_status_result?.dout_lower32} />
                            <BitFieldDisplay bitCount={32} value={emstat_status_result?.out_upper32} />
                        </Col>
                        <Col className="gutter-row" span={11}>
                            <div>
                                <h4>Integer IN</h4>
                            </div>
                            <div>
                                Number of Integer Ins defined in GBEM <Text underline>MAP_NUM_INTEGER_IN</Text> is:{" "}
                                {emstat_const_result?.number_of_integer_ins}
                            </div>
                            <ShowListNums dataObject={int_ins} />
                            <div>
                                <h4>Integer OUT</h4>
                            </div>
                            <ShowListNums dataObject={int_outs} />
                            <div>
                                Number of Integer Outs defined in GBEM <Text underline>MAP_NUM_INTEGER_OUT</Text> is:{" "}
                                {emstat_const_result?.number_of_integer_outs}
                            </div>
                            <div>
                                <h4>Float IN</h4>
                            </div>

                            <div>
                                Number of Float Ins defined in GBEM <Text underline>MAP_NUM_FLOAT_IN</Text> is:{" "}
                                {emstat_const_result?.number_of_float_ins}
                            </div>
                            <ShowListNums dataObject={float_ins} />
                            <div>
                                <h4>Float OUT</h4>
                            </div>

                            <div>
                                Number of Float Outs defined in GBEM <Text underline>MAP_NUM_FLOAT_OUT</Text> is:{" "}
                                {emstat_const_result?.number_of_float_outs}
                            </div>
                            <ShowListNums dataObject={float_outs} />
                        </Col>
                    </Row>
                </Card>
                <Card title="Status Frequency">
                    <StatusFreqTable>
                        <Slider
                            tipFormatter={null}
                            value={frequency}
                            onChange={setFrequency}
                            // onAfterChange={send_frequency}
                            min={0}
                            max={100}
                            step={25}
                            marks={{
                                0: "Slow (10s)",
                                50: "Medium (5s)",
                                100: "Fast (1s)"
                            }}
                        />
                        <div>{isLoading ? <ThunderboltFilled /> : " "}</div>
                    </StatusFreqTable>
                </Card>
            </main>
        </StyledApp>
    )
}

export default App
