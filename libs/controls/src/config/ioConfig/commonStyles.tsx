import styled from "styled-components"
import { Checkbox, Flex } from "antd"
import React from "react"

type StyledFlexProps = React.ComponentProps<typeof Flex>

// Define the styled Flex component
export const StyledFlex = styled(Flex)<StyledFlexProps>`
    display: flex;
    flex-direction: column;
    gap: 1px;
    height: 100%;
    padding: 4px 10px;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }

    .input-grid,
    .output-grid {
        display: grid;
        align-items: center;
        gap: 10px;
        overflow-y: auto;
    }

    .digital.input-grid {
        grid-template-columns: 4fr 3fr 1fr;
    }

    .digital.output-grid {
        grid-template-columns: 2fr 3fr 1fr;
    }

    .integer.input-grid {
        grid-template-columns: 2fr 3fr;
    }

    .digital.input-grid .input-column {
        justify-self: center; /* Center horizontally in the grid cell */
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
