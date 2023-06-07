/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { createContext, useContext, useMemo } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"
import { ConfigProvider, theme as antdTheme, ThemeConfig } from "antd"
import styled, { css, ThemeProvider } from "styled-components"

type GlowbuzzerThemeContextType = {
    darkMode: boolean
    setDarkMode: (darkMode: boolean) => void
}

const GlowbuzzerThemeContext = createContext<GlowbuzzerThemeContextType>(null)

const StyledGlowbuzzerApp = styled.div<{ darkMode: boolean }>`
    // these are copied from flexlayout-react/style/dark.css, allowing us to switch dynamically
    .flexlayout__layout {
        ${props =>
            props.darkMode &&
            css`
                --color-text: #eeeeee;
                --color-background: black;
                --color-base: black;
                --color-1: #121212;
                --color-2: #1a1a1a;
                --color-3: #262626;
                --color-4: #333333;
                --color-5: #404040;
                --color-6: #4d4d4d;
                --color-drag1: rgb(207, 232, 255);
                --color-drag2: rgb(183, 209, 181);
                --color-drag1-background: rgba(128, 128, 128, 0.15);
                --color-drag2-background: rgba(128, 128, 128, 0.15);
                --font-size: medium;
                --font-family: Roboto, Arial, sans-serif;
                --color-overflow: gray;
                --color-icon: gray;
                --color-tabset-background: var(--color-1);
                --color-tabset-background-selected: var(--color-1);
                --color-tabset-background-maximized: var(--color-6);
                --color-tabset-divider-line: var(--color-4);
                --color-tabset-header-background: var(--color-1);
                --color-tabset-header: var(--color-text);
                --color-border-background: var(--color-1);
                --color-border-divider-line: var(--color-4);
                --color-tab-selected: var(--color-text);
                --color-tab-selected-background: var(--color-4);
                --color-tab-unselected: gray;
                --color-tab-unselected-background: transparent;
                --color-tab-textbox: var(--color-text);
                --color-tab-textbox-background: var(--color-3);
                --color-border-tab-selected: var(--color-text);
                --color-border-tab-selected-background: var(--color-4);
                --color-border-tab-unselected: gray;
                --color-border-tab-unselected-background: var(--color-2);
                --color-splitter: var(--color-2);
                --color-splitter-hover: var(--color-4);
                --color-splitter-drag: var(--color-5);
                --color-drag-rect-border: var(--color-4);
                --color-drag-rect-background: var(--color-1);
                --color-drag-rect: var(--color-text);
                --color-popup-border: var(--color-6);
                --color-popup-unselected: var(--color-text);
                --color-popup-unselected-background: black;
                --color-popup-selected: var(--color-text);
                --color-popup-selected-background: var(--color-4);
                --color-edge-marker: gray;
            `}
    }
`

const GlowbuzzerThemeInner = ({ children, darkMode }) => {
    const { token } = antdTheme.useToken()
    return (
        <ThemeProvider theme={token}>
            <StyledGlowbuzzerApp darkMode={darkMode}>{children}</StyledGlowbuzzerApp>
        </ThemeProvider>
    )
}

type GlowbuzzerThemeProviderProps = {
    children: React.ReactNode
    theme?: ThemeConfig
    darkModeDefault?: boolean
}

export const GlowbuzzerThemeProvider = ({
    children,
    theme = {},
    darkModeDefault
}: GlowbuzzerThemeProviderProps) => {
    const darkModeSystemDefault =
        !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

    const [darkModeUser, setDarkMode] = useLocalStorage("darkMode", undefined)

    const darkMode = darkModeDefault ?? darkModeUser ?? darkModeSystemDefault

    const custom_theme = useMemo<ThemeConfig>(() => {
        return {
            algorithm: darkMode ? [antdTheme.darkAlgorithm] : undefined,
            token: {
                colorPrimary: "rgb(146, 84, 222)",
                colorLink: "rgb(146, 84, 222)",
                ...theme
            }
        }
    }, [darkMode, theme])

    return (
        <GlowbuzzerThemeContext.Provider value={{ darkMode, setDarkMode }}>
            <ConfigProvider theme={custom_theme}>
                <GlowbuzzerThemeInner darkMode={darkMode}>{children}</GlowbuzzerThemeInner>
            </ConfigProvider>
        </GlowbuzzerThemeContext.Provider>
    )
}

export function useGlowbuzzerTheme() {
    const context = useContext(GlowbuzzerThemeContext)
    if (!context) {
        throw new Error("No glowbuzzer theme context")
    }
    return context
}
