import * as React from "react"
import { useState } from "react"
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
    ModbusUiinConfig,
    useModbusUnsignedIntegerInputList,
    WithNameAndDescription
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { DeleteOutlined } from "@ant-design/icons"
import { StyledFlex, StyledToolTipDiv, SwitchContainer } from "./commonStyles"
import { HexDecInput } from "./HexDecInput"
import { ConsecutiveAddressesInfoContent } from "./ConsecutiveAddressesInfoContent"
import { ActionButton } from "./ActionButton"

const { Option } = Select

const GridContainer = styled.div`
    display: grid;
    //grid-template-columns: 1fr 3fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr;
    gap: 1px; /* Optional for spacing */
`
const groupColors = ["#2C1517", "#112B30", "#1D2B19", "#12142F"]

// Define the props for GridRow
interface GridRowProps {
    groupIndex: number
}

// Child rows styled as grids but inheriting the parent's column structure
const GridRow = styled.div<GridRowProps>`
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr;
    align-items: center; /* Center content vertically */
    background-color: ${props =>
        groupColors[props.groupIndex % groupColors.length]}; /* Conditional background color */
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
    input,
    hexFormat,
    update_name,
    update_slave_num,
    toggleAddressFormat,
    update_address,
    update_function,
    update_endian,
    update_inverted,
    deleteInput,
    grouped
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
                            value={input.name}
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
                            value={input.slave_num}
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
                    } address`}
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <div>
                        <HexDecInput
                            isHex={hexFormat[index] || false}
                            address={input.address}
                            update_address={update_address}
                            index={index}
                        />
                    </div>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Edit the Modbus function code"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <Select
                        size="small"
                        value={input.function}
                        onChange={value => update_function(index, value)}
                        style={{ width: "100%" }}
                    >
                        <Option value={3}>READ HOLDING REGISTERS</Option>
                        <Option value={4}>READ INPUT REGISTERS</Option>
                    </Select>
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
                        checked={input.little_endian}
                        onChange={e => update_endian(index, e)}
                    ></Checkbox>
                </Tooltip>
            </StyledToolTipDiv>
        </GridItem>
        <GridItem>
            <StyledToolTipDiv>
                <Tooltip
                    title="Set whether the IO object value is inverted"
                    placement="top"
                    mouseEnterDelay={1}
                    getPopupContainer={triggerNode => triggerNode}
                >
                    <Checkbox
                        checked={input.inverted}
                        onChange={e => update_inverted(index, e)}
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
                        onConfirm={() => deleteInput(index)}
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
    </>
)

/**
 * Component to configure Modbus digital inputs
 */
export const ModbusIntegerInputs: React.FC = () => {
    const current = useModbusUnsignedIntegerInputList()
    const [inputs, setInputs] = useState(current)

    const [tempInputs, setTempInputs] = useState(
        inputs.map(input => ({
            ...input,
            tempSlaveNum: input.slaveNum,
            tempAddress: input.address
        }))
    )

    const [isSorted, setIsSorted] = useState(false) // State to control sorting
    const toggleSort = () => setIsSorted(!isSorted) // Function to toggle sorting

    const [hexFormat, setHexFormat] = useState<{ [key: number]: boolean }>({}) // State for hex/decimal format

    const dispatch = useDispatch()

    // const myRef = useRef<HTMLInputElement | null>(null)

    function reset() {
        setInputs(current)
        setHexFormat({}) // Reset hex format state
    }

    function save() {
        dispatch(
            configSlice.actions.addConfig({
                modbusDin: inputs
            })
        )
    }

    function update_name(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs(current =>
            current.map((input, i) => (i === index ? { ...input, name: e.target.value } : input))
        )
    }

    function update_slave_num(index, e) {
        const newValue = parseInt(e.target.value, 10)
        if (!isDuplicate(newValue, inputs[index].address, index)) {
            setInputs(current =>
                current.map((input, i) => (i === index ? { ...input, slave_num: newValue } : input))
            )
        } else {
            // Handle the error, e.g., show an error message or revert the input
            message.warning(
                "Duplicate slave number and address combination - are you sure this is what you want?"
            )
        }
    }

    function update_address(index, value) {
        if (!isDuplicate(inputs[index].slaveNum, value, index)) {
            setInputs(current =>
                current.map((input, i) => (i === index ? { ...input, address: value } : input))
            )
        } else {
            // Handle the error
            message.warning(
                "Duplicate slave number and address combination - are you sure this is what you want?"
            )
        }
    }

    function update_function(index: number, value: number) {
        setInputs(current =>
            current.map((input, i) => (i === index ? { ...input, function: value } : input))
        )
    }

    function update_endian(index: number, e: CheckboxChangeEvent) {
        setInputs(current =>
            current.map((input, i) =>
                i === index ? { ...input, little_endian: e.target.checked } : input
            )
        )
    }

    function update_inverted(index: number, e: CheckboxChangeEvent) {
        setInputs(current =>
            current.map((input, i) =>
                i === index ? { ...input, inverted: e.target.checked } : input
            )
        )
    }

    function deleteInput(index: number) {
        setInputs(current => current.filter((_, i) => i !== index))
    }

    function addInput() {
        const newInput: WithNameAndDescription<ModbusUiinConfig> = {
            name: "",
            slaveNum: 1,
            address: 1,
            function: 1,
            description: "New input"
            // Initialize other fields as necessary
        }
        setInputs([...inputs, newInput])
    }

    // function toggleAddressFormat(checked: boolean) {
    //     setIsHex(checked)
    // }
    function toggleAddressFormat(index: number, checked: boolean) {
        setHexFormat(current => ({
            ...current,
            [index]: checked
        }))
    }

    function isDuplicate(slaveNumber, address, currentIndex) {
        return inputs.some((input, index) => {
            return (
                index !== currentIndex &&
                input.slaveNum === slaveNumber &&
                input.address === address
            )
        })
    }

    function getConsecutiveIndices(
        inputs: WithNameAndDescription<ModbusUiinConfig>[]
    ): Set<number> {
        const sortedInputs = [...inputs].sort((a, b) =>
            a.slaveNum === b.slaveNum ? a.address - b.address : a.slaveNum - b.slaveNum
        )
        const consecutiveIndices = new Set<number>()

        for (let i = 1; i < sortedInputs.length; i++) {
            // Check if the addresses are consecutive and belong to the same slave number
            if (
                sortedInputs[i].slaveNum === sortedInputs[i - 1].slaveNum &&
                sortedInputs[i].address === sortedInputs[i - 1].address + 1
            ) {
                consecutiveIndices.add(inputs.indexOf(sortedInputs[i]))
                consecutiveIndices.add(inputs.indexOf(sortedInputs[i - 1]))
            }
        }

        return consecutiveIndices
    }

    function groupConsecutiveIndices(
        indices: Set<number>,
        inputs: WithNameAndDescription<ModbusUiinConfig>[]
    ): number[][] {
        // Map indices to their respective addresses
        const addressMap = Array.from(indices).map(index => ({
            index,
            address: inputs[index].address
        }))

        // Sort by address
        const sortedAddressMap = addressMap.sort((a, b) => a.address - b.address)
        const groups: number[][] = []
        let currentGroup: number[] = []

        for (let i = 0; i < sortedAddressMap.length; i++) {
            const { index, address } = sortedAddressMap[i]
            if (
                currentGroup.length === 0 ||
                address === inputs[currentGroup[currentGroup.length - 1]].address + 1
            ) {
                currentGroup.push(index)
            } else {
                groups.push(currentGroup)
                currentGroup = [index]
            }
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup)
        }

        return groups
    }

    const consecutiveIndices = getConsecutiveIndices(inputs)
    const consecutiveGroups = groupConsecutiveIndices(consecutiveIndices, inputs)
    const formatAddress = (address: number, isHex: boolean) =>
        isHex ? address.toString(16).toUpperCase() : address.toString(10)

    const modified = JSON.stringify(inputs) !== JSON.stringify(current)

    const buttonLabel = isSorted ? "Show ungrouped IO" : "Show IO groups" // Dynamic label based on isSorted

    return (
        <>
            <StyledFlex>
                <GridContainer>
                    {inputs.length === 0 && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No digital inputs have been configured"
                            imageStyle={{ height: 60 }}
                        />
                    )}
                    <Button size="small" onClick={toggleSort}>
                        {buttonLabel}{" "}
                    </Button>
                    {isSorted
                        ? consecutiveGroups.map((group, groupIndex) => (
                              <React.Fragment key={`group-${groupIndex}`}>
                                  {group.map(index => (
                                      <GridRow key={`row-${index}`} groupIndex={groupIndex}>
                                          <GridRowContent
                                              index={index}
                                              input={inputs[index]}
                                              hexFormat={hexFormat}
                                              update_name={update_name}
                                              update_slave_num={update_slave_num}
                                              toggleAddressFormat={toggleAddressFormat}
                                              update_address={update_address}
                                              update_function={update_function}
                                              update_endian={update_endian}
                                              update_inverted={update_inverted}
                                              deleteInput={deleteInput}
                                              grouped={true}
                                          />
                                      </GridRow>
                                  ))}
                              </React.Fragment>
                          ))
                        : inputs.map((input, index) => (
                              <GridRow key={`row-${index}`} groupIndex={-1}>
                                  <GridRowContent
                                      index={index}
                                      input={input}
                                      hexFormat={hexFormat}
                                      update_name={update_name}
                                      update_slave_num={update_slave_num}
                                      toggleAddressFormat={toggleAddressFormat}
                                      update_address={update_address}
                                      update_function={update_function}
                                      update_endian={update_endian}
                                      update_inverted={update_inverted}
                                      deleteInput={deleteInput}
                                      grouped={false}
                                  />
                              </GridRow>
                          ))}
                </GridContainer>
                <div className="actions">
                    <Space>
                        <ActionButton
                            onClick={save}
                            disabled={!modified}
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
                            onClick={addInput}
                            disabled={inputs.length > 7}
                            tooltipTitle={
                                inputs.length > 7
                                    ? "Maximum limit on inputs reached (8)"
                                    : "Add a new input to the list"
                            }
                            type="default"
                        >
                            Add input
                        </ActionButton>
                    </Space>
                    <Popover
                        content={<ConsecutiveAddressesInfoContent />}
                        title="More information on modbus IO grouping"
                        placement="right"
                        style={{ maxWidth: "200px" }}
                    >
                        <span style={{ fontStyle: "italic" }}>more info on IO grouping...</span>
                    </Popover>
                </div>
            </StyledFlex>
        </>
    )
}
