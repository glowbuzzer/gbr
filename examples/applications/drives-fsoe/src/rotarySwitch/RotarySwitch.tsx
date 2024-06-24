// RotarySwitch.tsx

import React from "react"
import { Switch } from "antd"
import styled from "styled-components"

interface RotarySwitchProps {
    checked: boolean
    onChange: (checked: boolean) => void
}

const RotarySwitchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`

const StyledSwitch = styled(Switch)<{ checked: boolean }>`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f0f0f0;
    border: 2px solid #ccc;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;

    .ant-switch-handle {
        display: none;
    }

    &:before {
        content: "";
        width: 4px; //width of indicator line
        height: 18px; //length of indicator line
        background-color: #333;
        position: absolute;
        top: 35%;
        left: 50%;
        transform: ${({ checked }) =>
            checked
                ? "translate(-50%, -50%) rotate(0deg)"
                : "translate(-50%, -50%) rotate(-90deg)"};
        transform-origin: bottom;
        transition: transform 0.3s ease;
    }
`

const Label = styled.div`
    position: absolute;
    font-size: 12px;
`

const OffLabel = styled(Label)`
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
`

const OnLabel = styled(Label)`
    right: 20px;
    top: -20%;
    transform: translateY(-50%);
`

const RotarySwitch: React.FC<RotarySwitchProps> = ({ checked, onChange }) => {
    return (
        <RotarySwitchContainer>
            <OffLabel>Off</OffLabel>
            <StyledSwitch checked={checked} onChange={onChange} />
            <OnLabel>On</OnLabel>
        </RotarySwitchContainer>
    )
}

export default RotarySwitch
