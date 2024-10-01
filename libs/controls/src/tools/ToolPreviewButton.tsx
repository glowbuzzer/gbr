/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Modal } from "antd"
import { ToolModelPreview } from "./ToolModelPreview"
import { Suspense } from "react"

export const ToolPreviewButton = ({ filename }) => {
    const [open, setOpen] = React.useState(false)

    if (!filename) {
        return null
    }

    return (
        <>
            <Button size="small" onClick={() => setOpen(true)}>
                View
            </Button>
            <Modal
                title="Tool Model Preview"
                open={open}
                footer={<Button onClick={() => setOpen(false)}>Close</Button>}
            >
                <Suspense>
                    <div>
                        <ToolModelPreview filename={filename} />
                    </div>
                </Suspense>
            </Modal>
        </>
    )
}
