import * as React from "react"
import { useContext, useState } from "react"

import styled from "styled-components"

import { Radio } from "antd"

/*
1. import csv
2. convert to an object - joint positions time. This should be an array of objects with each array element being a joint position at a time.
3. save json object to context
4. in 3d scene use context to get joint positions
5. animate 3d scene with useFrame

user should enter speed to playback at

 */

export const PlaybackTile = props => {
    const [file, setFile] = useState()
    const [array, setArray] = useState([])

    const fileReader = new FileReader()

    const handleOnChange = e => {
        setFile(e.target.files[0])
    }

    const handleOnSubmit = e => {
        e.preventDefault()

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result
                csvFileToArray(text)
            }

            fileReader.readAsText(file)
        }
    }

    const csvFileToArray = string => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",")
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n")

        const array = csvRows.map(i => {
            const values = i.split(",")
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index]
                return object
            }, {})
            return obj
        })

        setArray(array)
    }
    const headerKeys = Object.keys(Object.assign({}, ...array))

    console.log(array[0].j0)

    return (
        <StyledDiv>
            <div className="row">
                <h3>playback recorded moves</h3>
                <div style={{ textAlign: "center" }}>
                    <form>
                        <input
                            type={"file"}
                            id={"csvFileInput"}
                            accept={".csv"}
                            onChange={handleOnChange}
                        />

                        <button
                            onClick={e => {
                                handleOnSubmit(e)
                            }}
                        >
                            IMPORT CSV
                        </button>
                    </form>

                    <table>
                        <thead>
                            <tr key={"header"}>
                                {headerKeys.map(key => (
                                    <th>{key}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {array.map(item => (
                                <tr key={item.id}>
                                    {Object.values(item).map(val => (
                                        <td>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
