import { FC } from "react"
import styled from "@emotion/styled"

export const StyledDiv = styled.div`
    color: purple;
`

export const PurpleText: FC = ({ children }) => {
    return <StyledDiv>{children}</StyledDiv>
}
