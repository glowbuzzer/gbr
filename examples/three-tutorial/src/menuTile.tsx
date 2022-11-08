import * as React from "react"
import {
    useContext,
} from "react"

import styled from "styled-components"

import {Radio} from "antd"


import {ActiveExampleContext} from "./activeExampleContext";


export const ChooseExample = (props) => {

    const {activeExample, setActiveExample} = useContext(ActiveExampleContext)

    const handleExampleChange = (event) => {
        setActiveExample(event.target.value)
        console.log("handler")
        console.log(setActiveExample)
    }

    return (
        <StyledDiv>
            <div className="row">
                <h3>three-tutorial examples</h3>
            </div>
            <div className="row">
                <h4>Basic examples</h4>
            </div>
            <div className="row">
                <div className="label">Pick example number to run</div>
                <div className="controls">
                    <Radio.Group
                        disabled={false}
                        size={"small"}
                        onChange={handleExampleChange}
                        value={activeExample}
                    >
                        <Radio.Button value={1}>
                            1
                        </Radio.Button>

                        <Radio.Button value={2}>
                            2
                        </Radio.Button>

                        <Radio.Button value={3}>
                            3
                        </Radio.Button>
                        <Radio.Button value={4}>
                            4
                        </Radio.Button>
                        <Radio.Button value={5}>
                            5
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <p>(1) = adding a sphere, (2) = moving box with texture, (3) = spotlight on TCP, (4) = physics, demolish
                    a wall, (5) = sprites and text</p>
            </div>
            <div className="row">
                <h4>Medium examples</h4>
            </div>
            <div className="row">
                <div className="label">Pick example number to run</div>
                <div className="controls">
                    <Radio.Group
                        disabled={false}
                        size={"small"}
                        onChange={handleExampleChange}
                        value={activeExample}
                    >
                        <Radio.Button value={6}>
                            6
                        </Radio.Button>

                        <Radio.Button value={7}>
                            7
                        </Radio.Button>

                        <Radio.Button value={8}>
                            8
                        </Radio.Button>
                        <Radio.Button value={9}>
                            9
                        </Radio.Button>
                        <Radio.Button value={10}>
                            10
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <p>(6) = Show object co-ordinates, (7) = Move object in scene, (8) = Object collision detection, (9) = Points from config, 10 = Exmaple UI</p>
            </div>
            <div className="row">
                <h4>Advanced examples</h4>
            </div>
            <div className="row">
                <div className="label">Pick example number to run</div>
                <div className="controls">
                    <Radio.Group
                        disabled={false}
                        size={"small"}
                        onChange={handleExampleChange}
                        value={activeExample}
                    >
                        <Radio.Button value={11}>
                            11
                        </Radio.Button>

                        <Radio.Button value={12}>
                            12
                        </Radio.Button>
                        <Radio.Button value={13}>
                            13
                        </Radio.Button>
                        <Radio.Button value={14}>
                            14
                        </Radio.Button>
                        <Radio.Button value={15}>
                            15
                        </Radio.Button>
                    </Radio.Group>
                </div>
            </div>
            <div className="row">
                <p>(11) = object position from encoder, (12) = modelling a gripper, (13) = digital inputs display, (14) = using springs to create interactive controls, (15) = creating a 3D UI </p>
            </div>

        </StyledDiv>
    )
}


const StyledDiv = styled.div`
    padding: 5px;

    .row {
        &.padded {
            padding: 12px 0;
        }

        padding: 2px 0;
        display: flex;
        justify-content: stretch;
        gap: 20px;
        align-items: center;

        .label {
            flex-grow: 1;
        }
    }
    .ant-radio-group {
            display: flex;
            justify-content: stretch;

            .ant-radio-button-wrapper {
                flex-grow: 1;
                flex-basis: 0;
                text-align: center;
            }

            .ant-radio-button-wrapper:first-child {
                border-radius: 10px 0 0 10px;
            }

            .ant-radio-button-wrapper:last-child {
                border-radius: 0 10px 10px 0;
            }
        }

        .controls {
            min-width: 180px;
            text-align: right;

        }


`