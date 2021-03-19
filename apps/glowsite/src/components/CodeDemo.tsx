import React from "react"
import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "@glowbuzzer/store"
import { Provider } from "react-redux"

import Prism from "prismjs"
import styled from "styled-components"

const StyledCodeDemo = styled.div`
    .example {
        border: 1px solid black;
        padding: 10px;
    }
`

export const CodeDemoStoreProvider = ({ children }) => {
    const middleware = getDefault => {
        return getDefault({ immutableCheck: false, serializableCheck: false })
    }

    const store = configureStore({
        reducer: rootReducer,
        middleware
    })

    return <Provider store={store}>{children}</Provider>
}

export const CodeDemo = ({ code, children }) => {
    const html = Prism.highlight(code, Prism.languages.javascript, "javascript")

    return (
        <StyledCodeDemo>
            <div className="example">
                {/* the react rendered demo */}
                {children}
            </div>
            <div className="gatsby-highlight">
                <pre className="language-jsx" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </StyledCodeDemo>
    )
}
