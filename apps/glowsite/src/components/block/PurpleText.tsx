import { FC } from "react"
import styled from "styled-components"

export const StyledDiv = styled.div`
    color: purple;
`

export const PurpleText: FC = ({ children }) => {
    return <StyledDiv>{children}</StyledDiv>
}
