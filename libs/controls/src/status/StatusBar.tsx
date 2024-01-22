/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useConnection, useMachine } from "@glowbuzzer/store"
import styled from "styled-components"
import { ConnectStatusIndicator } from "./ConnectStatusIndicator"
import { useStatusTrayDismissedItems } from "./StatusTrayProvider"
import { Button } from "antd"

const StyledDiv = styled.div`
    //z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8em;

    > div {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`

/**
 * Status bar at the bottom of the screen
 */
export const StatusBar = () => {
    const { connected } = useConnection()
    const { dismissed, undismissAll } = useStatusTrayDismissedItems()
    const { name } = useMachine()

    return (
        <StyledDiv>
            <div>
                <ConnectStatusIndicator connected={connected} />
                {connected ? <div>{name} CONNECTED</div> : <>NOT CONNECTED</>}
            </div>
            {!!dismissed.length && (
                <div>
                    <Button size="small" type="dashed" onClick={undismissAll}>{`${
                        dismissed.length
                    } hidden notification${dismissed.length > 1 ? "s" : ""}`}</Button>
                </div>
            )}
        </StyledDiv>
    )
}
