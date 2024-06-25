import styled from "styled-components"
import { Checkbox, Flex } from "antd"
import React from "react"

type StyledFlexProps = React.ComponentProps<typeof Flex>

// Define the styled Flex component
export const StyledFlex = styled(Flex)<StyledFlexProps>`
    display: flex;
    flex-direction: column;
    gap: 1px;
    justify-content: space-between;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }

    .digital-input-grid {
        display: grid;
        align-items: center;
        //justify-items: center;
        grid-template-columns: 4fr 3fr 1fr;
        gap: 10px;
    }

    .digital-input-grid .description-column {
        //justify-items: left;
    }

    .digital-input-grid .input-column {
        justify-self: center; /* Center horizontally in the grid cell */
    }

    .digital-output-grid {
        display: grid;
        align-items: center;
        grid-template-columns: 2fr 3fr 1fr;
        gap: 10px;
    }

    .integer-input-grid {
        display: grid;
        align-items: center;
        grid-template-columns: 2fr 3fr;
        gap: 10px;
    }

    .modbus-digital-input-grid {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 3fr 1fr 1fr 2fr 1fr 1fr 1fr 1fr;
        gap: 0;
        position: relative;
    }

    .actions {
        margin-top: 5px;
        display: flex;
        justify-content: space-between; /* Space between children */
        align-items: center; /* Center vertically */
    }
`

export const PopoverContent = styled.div`
    max-width: 400px;
    white-space: pre-wrap;
    word-wrap: break-word;
`

export const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const CenteredCheckboxWrapper = styled.div`
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    width: 100%; /* Full width of the parent */
    height: 100%; /* Full height of the parent */
`

// Wrapped Centered Checkbox Component
export const CenteredCheckbox = props => (
    <CenteredCheckboxWrapper>
        <Checkbox {...props} />
    </CenteredCheckboxWrapper>
)

export const StyledToolTipDiv = styled.div`
    /* Target the outer tooltip wrapper when the tooltip is placed at the top */

    display: contents;

    .ant-tooltip-placement-top > .ant-tooltip-content {
        margin-bottom: 10px; /* Adjust the distance here */
        //background-color: green; /* Adjust background if needed */
    }
`
