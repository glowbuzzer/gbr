import { Link } from "gatsby"
import React from "react"
import { useGbcSchemaNav } from "./hooks"
import styled from "styled-components"

const StyledDiv = styled.div`
    .group {
        column-count: 4;
        column-width: 250px;
    }
`

export const GbcSchemaBodyNav = () => {
    const groups = useGbcSchemaNav()

    return (
        <StyledDiv>
            {Object.keys(groups).map(k => (
                <div key={k}>
                    <h2>{k}</h2>
                    <div className="group">
                        {groups[k].map(item => (
                            <div className="item" key={item.name}>
                                <Link to={"/docs/gbc/schema/" + item.name}>{item.name}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </StyledDiv>
    )
}
