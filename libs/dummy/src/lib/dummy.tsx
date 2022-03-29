import React from "react"

import styled from "styled-components"

const StyledDummy = styled.div`
    color: pink !important;
`

export function Dummy() {
    return (
        <StyledDummy>
            <h1>Welcome to dummy! XX</h1>
        </StyledDummy>
    )
}
