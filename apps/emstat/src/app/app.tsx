import React, { useEffect, useState } from "react"

import styled from "styled-components"

const StyledApp = styled.div`
    header {
        font-size: 2em;
    }

    .name {
        font-size: 1.5em;
    }

    .url {
    }
`

export const App = () => {
    const [result, setResult] = useState(null)
    const [zen, setZen] = useState("")

    useEffect(
        () => {
            fetch("https://api.github.com/users/glowbuzzer")
                .then(result => result.json())
                .then(json => setResult(json))
        },
        [
            /**
             * When this dependency list is empty, effect is run once on page load
             **/
        ]
    )

    useEffect(() => {
        fetch("https://api.github.com/zen")
            .then(result => result.text())
            .then(txt => setZen(txt))
    }, [])

    return (
        <StyledApp>
            <header>Welcome to emstat!</header>
            <main>
                <div className="name">{result?.name}</div>
                <a href={result?.url}>{result?.url}</a>
                <div className="zen">{zen}</div>
            </main>
        </StyledApp>
    )
}

export default App
