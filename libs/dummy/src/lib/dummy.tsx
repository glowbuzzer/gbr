import React from "react"

import styled from "styled-components"

/* eslint-disable-next-line */
export interface DummyProps {}

const StyledDummy = styled.div`
    color: pink !important;
`

export function Dummy(props: DummyProps) {
    return (
        <StyledDummy>
            <h1>Welcome to dummy! XX</h1>
        </StyledDummy>
    )
}
