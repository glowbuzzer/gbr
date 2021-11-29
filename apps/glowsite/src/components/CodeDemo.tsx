import React from "react"
import { configureStore } from "@reduxjs/toolkit"
import {
    jointsSlice,
    configSlice,
    rootReducer,
    toolPathSlice,
    previewSlice
} from "@glowbuzzer/store"
import { Provider } from "react-redux"
import { GLOWSITE_GBC_CONFIG } from "./gbc_config"

import Prism from "prismjs"
import styled from "@emotion/styled"

const HtmlCoding = () => (
    <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 502.664 502.664">
        <g>
            <g>
                <path
                    d="M153.821,358.226L0,274.337v-46.463l153.821-83.414v54.574L46.636,250.523l107.185,53.431
			C153.821,303.954,153.821,358.226,153.821,358.226z"
                />
                <path d="M180.094,387.584L282.103,115.08h32.227L212.084,387.584H180.094z" />
                <path
                    d="M348.843,358.226v-54.272l107.164-52.999l-107.164-52.59v-53.927l153.821,83.522v46.183
			L348.843,358.226z"
                />
            </g>
        </g>
    </svg>
)

const StyledCodeDemo = styled.div`
    .example {
        border: 1px solid #c8c8c8;
        padding: 10px;
    }

    .code-expand {
        float: right;
        width: 32px;
        height: 32px;
        cursor: pointer;
        user-select: none;
        padding-right: 4px;
        margin-left: 20px;
    }

    .code-expand-show path {
        fill: #be9112;
    }

    .copy-button {
        background: #666666;
        border: none;
        //border-radius: 4px;
        color: #f0f0f0;
        cursor: pointer;
        line-height: 12px;
        opacity: 0;
        //outline: none;
        padding: 4px 8px;
        position: absolute;
        right: 0;
        top: 0;
        visibility: hidden;
        transition: opacity 200ms ease-in-out, visibility 200ms ease-in-out,
            bottom 200ms ease-in-out;
    }

    .copy-button:focus {
        border: none !important;
    }

    .gatsby-highlight {
        position: relative;
    }

    .gatsby-highlight:hover .copy-button {
        visibility: visible;
        opacity: 1;
    }

    pre {
        margin: 0;
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

    // load dummy config
    store.dispatch(configSlice.actions.setConfig(GLOWSITE_GBC_CONFIG))

    // init dummy joint state
    store.dispatch(
        jointsSlice.actions.status(
            Object.keys(GLOWSITE_GBC_CONFIG.joint).map(() => ({
                statusWord: 0,
                controlWord: 0,
                actPos: 0,
                actVel: 0,
                actAcc: 0
            }))
        )
    )

    // init dummy toolpath
    const revolutions = 5
    const resolution = 20
    const scale = 4
    const angle = n => (Math.PI * 2 * n) / resolution
    const path = Array.from({ length: revolutions * resolution }).map((_, n) => [
        Math.sin(angle(n)) * scale,
        Math.cos(angle(n)) * scale,
        (n / resolution) * 0.2 * scale
    ])
    store.dispatch(previewSlice.actions.setSimple(path))

    return <Provider store={store}>{children}</Provider>
}

export const CodeDemo = ({ code, children }) => {
    const [showCode, setShowCode] = React.useState(false)
    const [showCopied, setShowCopied] = React.useState(false)
    const button = React.useRef(null)

    const handleCopyCode = () => {
        window.getSelection().empty()
        setShowCopied(true)

        setTimeout(() => setShowCopied(false), 2000)
    }

    const toggleCode = () => {
        setShowCode(!showCode)
    }

    const html = Prism.highlight(code, Prism.languages.javascript, "javascript")

    return (
        <StyledCodeDemo>
            <div className="example">
                <div
                    onClick={toggleCode}
                    className={"code-expand" + (showCode ? " code-expand-show" : "")}
                >
                    <HtmlCoding />
                </div>
                {/* the react rendered demo */}
                {children}
            </div>
            {showCode && (
                <div className="gatsby-highlight">
                    <pre className="language-jsx" dangerouslySetInnerHTML={{ __html: html }} />
                    <div
                        ref={button}
                        aria-label="Copy code to clipboard"
                        className="copy-button"
                        onClick={handleCopyCode}
                    >
                        {showCopied ? "Copied!" : "Copy"}
                    </div>
                </div>
            )}
        </StyledCodeDemo>
    )
}
