import * as React from "react"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import {
    Button,
    Checkbox,
    Empty,
    Input,
    message,
    Popconfirm,
    Popover,
    Select,
    Space,
    Switch,
    Tooltip
} from "antd"
import styled from "styled-components"
import {
    configSlice,
    ModbusUioutConfig,
    useModbusIntegerOutputList,
    WithNameAndDescription
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { DeleteOutlined } from "@ant-design/icons"
import { StyledFlex, StyledToolTipDiv, SwitchContainer } from "./commonStyles"
import { HexDecInput } from "./HexDecInput"
import { consecutiveAddressesInfoContent } from "./commonContent"
import { ActionButton } from "./CommonComponents"

const { Option } = Select

const GridContainer = styled.div`
    display: grid;
    //grid-template-columns: 1fr 3fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr;
    gap: 1px; /* Optional for spacing */
`

// Define the props for GridRow
interface GridRowProps {}

// Child rows styled as grids but inheriting the parent's column structure
const GridRow = styled.div<GridRowProps>`
    display: grid;
    grid-template-columns: 1fr 3fr 2fr 1fr 2fr 2fr 1fr 1fr;
    align-items: center; /* Center content vertically */
    border-radius: 8px; /* Round the corners */
    padding: 1px; /* Example padding */
`

// Grid items
const GridItem = styled.div`
    /* Optional individual item styling */
    padding: 1px;
    display: flex; /* Use flexbox */
    justify-content: center; /* Center content horizontally */
    //border: 1px solid #ccc;
`

const GridRowContent = ({
    index,
    output,
    hexFormat,
    update_name,
    update_slave_num,
    toggleAddressFormat,
    update_end_address,
    update_start_address,
    update_endian,
    deleteOutput,
    error
}) => (
    <>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Index of the IO object"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    {index}
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Edit the name of the IO object"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div>
                        <Input
                            type="text"
                            size="small"
                            value={output.name}
                            onChange={e => update_name(index, e)}
                        />
                    </div>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Edit the Modbus slave number"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div>
                        <Input
                            type="number"
                            size="small"
                            min={1}
                            max={247}
                            step={1}
                            onKeyDown={e => {
                                if (
                                    e.key === "e" ||
                                    e.key === "E" ||
                                    e.key === "-" ||
                                    e.key === "+" ||
                                    e.key === "."
                                ) {
                                    e.preventDefault()
                                }
                            }}
                            value={output.slave_num}
                            onChange={e => update_slave_num(index, e)}
                        />
                    </div>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title={`Control address format (hex / dec)`}
                    mouseEnterDelay={1}
                    placement="top"
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <SwitchContainer>
                        <Switch
                            checked={hexFormat[index] || false}
                            onChange={checked => toggleAddressFormat(index, checked)}
                            checkedChildren="Hex"
                            unCheckedChildren="Dec"
                            size="small"
                        />
                    </SwitchContainer>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title={`Edit the Modbus ${
                        hexFormat[index] ? "hexadecimal" : "decimal"
                    } start address`}
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div>
                        <HexDecInput
                            isHex={hexFormat[index] || false}
                            address={output.start_address}
                            update_address={update_start_address}
                            index={index}
                        />
                    </div>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title={`Edit the Modbus ${
                        hexFormat[index] ? "hexadecimal" : "decimal"
                    } end address`}
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div>
                        <HexDecInput
                            isHex={hexFormat[index] || false}
                            address={output.end_address}
                            update_address={update_end_address}
                            index={index}
                        />
                    </div>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>

        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Set whether the modbus slave returns little endian data"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <Checkbox
                        checked={output.little_endian}
                        onChange={e => update_endian(index, e)}
                    ></Checkbox>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>

        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Delete the modbus IO object"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => deleteOutput(index)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                            style={{
                                padding: 0,
                                border: "none",
                                width: "50px",
                                height: "auto"
                            }}
                        />
                    </Popconfirm>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        {error && <GridItem style={{ gridColumn: "span 9", color: "red" }}>{error}</GridItem>}
    </>
)

export const ModbusIntegerOutputs: React.FC = () => {
    const current = useModbusIntegerOutputList()
    const [outputs, setOutputs] = useState(current)
    const [validationErrors, setValidationErrors] = useState({})

    const [hexFormat, setHexFormat] = useState<{ [key: number]: boolean }>({}) // State for hex/decimal format

    const dispatch = useDispatch()

    // const myRef = useRef<HTMLInputElement | null>(null)

    function validateAndSetErrors(newOutputs) {
        const errors = {}
        newOutputs.forEach((output, index) => {
            const error = validateAddresses(output)
            if (error) {
                errors[index] = error
            }
        })
        setValidationErrors(errors)
    }

    function reset() {
        setOutputs(current)
        setHexFormat({}) // Reset hex format state
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                modbusDout: outputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setOutputs(current =>
            current.map((output, i) => (i === index ? { ...output, name: e.target.value } : output))
        )
    }

    function update_slave_num(index, e) {
        const newValue = parseInt(e.target.value, 10)

        setOutputs(current =>
            current.map((output, i) => (i === index ? { ...output, slave_num: newValue } : output))
        )
    }

    function update_start_address(index, value) {
        setOutputs(current => {
            const newOutputs = current.map((output, i) =>
                i === index ? { ...output, start_address: value } : output
            )
            validateAndSetErrors(newOutputs)
            return newOutputs
        })
    }

    function update_end_address(index, value) {
        setOutputs(current => {
            const newOutputs = current.map((output, i) =>
                i === index ? { ...output, end_address: value } : output
            )
            validateAndSetErrors(newOutputs)
            return newOutputs
        })
    }

    function update_endian(index: number, e: CheckboxChangeEvent) {
        setOutputs(current =>
            current.map((output, i) =>
                i === index ? { ...output, little_endian: e.target.checked } : output
            )
        )
    }

    function deleteOutput(index: number) {
        setOutputs(current => current.filter((_, i) => i !== index))
    }

    function addOutput() {
        const newOutput: WithNameAndDescription<ModbusUioutConfig> = {
            name: "",
            slave_num: 1,
            start_address: 1,
            end_address: 2,
            description: "New input"
            // Initialize other fields as necessary
        }
        setOutputs([...outputs, newOutput])
    }

    function toggleAddressFormat(index: number, checked: boolean) {
        setHexFormat(current => ({
            ...current,
            [index]: checked
        }))
    }

    const formatAddress = (address: number, isHex: boolean) =>
        isHex ? address.toString(16).toUpperCase() : address.toString(10)

    useEffect(() => {
        validateAndSetErrors(outputs)
    }, [outputs])

    function validateAddresses(output) {
        const { start_address, end_address } = output
        const difference = end_address - start_address

        if (start_address > end_address) {
            return "Start address must be less than equal to the end address"
        }

        if (difference >= 6) {
            return "Only 6 outputs can read in a single Modbus request"
        }

        return null
    }

    const modified = JSON.stringify(outputs) !== JSON.stringify(current)

    return (
        <>
            <StyledFlex>
                <GridContainer>
                    {outputs.length === 0 && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No digital inputs have been configured"
                            imageStyle={{ height: 60 }}
                        />
                    )}

                    {outputs.map((output, index) => (
                        <GridRow key={`row-${index}`}>
                            <GridRowContent
                                index={index}
                                output={output}
                                hexFormat={hexFormat}
                                update_name={update_name}
                                update_slave_num={update_slave_num}
                                toggleAddressFormat={toggleAddressFormat}
                                update_start_address={update_start_address}
                                update_end_address={update_end_address}
                                update_endian={update_endian}
                                deleteOutput={deleteOutput}
                                error={validationErrors[index]}
                            />
                        </GridRow>
                    ))}
                </GridContainer>
                <div className="actions">
                    <Space>
                        <ActionButton
                            onClick={save}
                            disabled={!modified || Object.keys(validationErrors).length > 0}
                            tooltipTitle="Save the changes to the IO configuration"
                            type="primary"
                        >
                            Save
                        </ActionButton>

                        <ActionButton
                            onClick={reset}
                            disabled={!modified}
                            tooltipTitle="Reset the changes to the IO configuration"
                            type="default"
                        >
                            Reset
                        </ActionButton>

                        <ActionButton
                            onClick={addOutput}
                            disabled={outputs.length > 7}
                            tooltipTitle={
                                outputs.length > 7
                                    ? "Maximum limit on inputs reached (8)"
                                    : "Add a new input to the list"
                            }
                            type="default"
                        >
                            Add input
                        </ActionButton>
                    </Space>
                </div>
            </StyledFlex>
        </>
    )
}
