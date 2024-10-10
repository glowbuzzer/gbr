/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import { DismissType, useStatusTray } from "./StatusTrayProvider"
import styled from "styled-components"
import { Button } from "antd"
import { possible_transitions, useMachineControlWord } from "@glowbuzzer/store"

const StyledDiv = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px;

    &:not(:last-child) {
        border-bottom: 2px dotted ${props => props.theme.colorWarningBorder};
    }

    color: ${props => props.theme.colorTextSecondary};

    .content {
        flex-grow: 1;
    }

    .actions {
        flex-basis: 0;
    }
`

type StatusTrayItemProps = {
    id: string
    dismissable?: DismissType
    children: React.ReactNode
    actions?: React.ReactNode
}

/**
 * Item in the status tray
 * @param id The unique id for this item
 * @param dismissable Whether this item can be dismissed or not, or whether it requires a reset
 * @param children The content of the item
 * @param actions Additional actions to be displayed
 */
export const StatusTrayItem = ({
    id,
    dismissable = DismissType.NOT_DISMISSIBLE,
    children,
    actions = null
}: StatusTrayItemProps) => {
    const { registerItem, unregisterItem, dismissItem, visible } = useStatusTray(id)
    const [, setMachineControlWord] = useMachineControlWord()

    useEffect(() => {
        // register this item with the status tray, and unregister on unmount
        registerItem(id, dismissable)
        return () => unregisterItem(id)
    }, [id, dismissable, registerItem])

    function reset() {
        // issue a fault reset
        setMachineControlWord(possible_transitions.FaultReset())
    }

    if (!visible) {
        // don't render if not visible
        return null
    }

    const show_actions = dismissable || actions
    return (
        <StyledDiv>
            <div className="content">{children}</div>
            {show_actions && (
                <div className="actions">
                    {dismissable === DismissType.REQUIRE_RESET && (
                        <Button size="small" onClick={reset}>
                            Reset Fault
                        </Button>
                    )}
                    {dismissable === DismissType.DISMISSABLE && (
                        <Button size="small" onClick={() => dismissItem(id)}>
                            Dismiss
                        </Button>
                    )}
                    {actions}
                </div>
            )}
        </StyledDiv>
    )
}
