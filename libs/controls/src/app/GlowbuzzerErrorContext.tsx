/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useMemo, useState } from "react"
import { Button, Modal } from "antd"

type GlowbuzzerErrorState = {
    feature: string
    error: Error
}

type GlowbuzzerErrorContextType = (feature: string, error: Error) => void

const GlowbuzzerErrorContext = createContext<GlowbuzzerErrorContextType>(null)

export const GlowbuzzerErrorProvider = ({ children }) => {
    const [state, setState] = useState<GlowbuzzerErrorState>(null)

    const context: GlowbuzzerErrorContextType = useMemo(
        () => (feature: string, error: Error) => setState({ feature, error }),
        [setState]
    )

    return (
        <GlowbuzzerErrorContext.Provider value={context}>
            {state && (
                <Modal
                    open
                    footer={
                        <Button size="small" onClick={() => setState(null)}>
                            Dismiss
                        </Button>
                    }
                >
                    <h1>{state.feature}</h1>
                    <p>{state.error.message}</p>
                </Modal>
            )}
            {children}
        </GlowbuzzerErrorContext.Provider>
    )
}

export const useGlowbuzzerGlobalErrorHandler = () => {
    const context = React.useContext(GlowbuzzerErrorContext)
    if (!context) {
        throw new Error("useGlowbuzzerError must be used within a GlowbuzzerErrorProvider")
    }
    return context
}
