import React from "react"
import { DefaultLayoutWithMdxSupport } from "./DefaultLayoutWithMdxSupport"
import { Container } from "../components/Container"
import { DynamicLeftNav } from "../components/DynamicLeftNav"
import styled from "styled-components"

const StyledBodyArea = styled.div`
    display: flex;
    gap: 20px;

    min-height: calc(100vh - 482px);
`

export default ({ children, pageContext }) => {
    if (pageContext.layout === "docs") {
        return (
            <DefaultLayoutWithMdxSupport>
                <StyledBodyArea>
                    <DynamicLeftNav current={pageContext.slug} />
                    <Container>{children}</Container>
                </StyledBodyArea>
            </DefaultLayoutWithMdxSupport>
        )
    }
    return (
        <DefaultLayoutWithMdxSupport>
            <div>YIPPEE THIS IS LAYOUT</div>
            {children}
        </DefaultLayoutWithMdxSupport>
    )
}
