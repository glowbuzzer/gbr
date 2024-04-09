/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { FileModal, FileModalMode, useGbdb } from "."
import { createElement, useState } from "react"
import { useGbdbFacet } from "@glowbuzzer/store"

export function useGbdbMenu(facetName: string) {
    const [mode, setMode] = useState<FileModalMode>(FileModalMode.NONE)
    const facet = useGbdbFacet(facetName)
    const { save } = useGbdb()

    function onClose() {
        setMode(FileModalMode.NONE)
    }

    const menuItems = [
        {
            key: `${facetName}-new`,
            label: `New ${facetName}...`,
            style: { textTransform: "capitalize" },
            onClick: () => setMode(FileModalMode.NEW)
        },
        {
            key: `${facetName}-open`,
            label: `Open ${facetName}...`,
            style: { textTransform: "capitalize" },
            onClick: () => setMode(FileModalMode.OPEN)
        },
        {
            key: `${facetName}-save`,
            label: `Save ${facetName}`,
            disabled: !facet.modified || !facet._id,
            style: { textTransform: "capitalize" },
            onClick: () => save(facetName)
        },
        {
            key: `${facetName}-save-as`,
            label: `Save ${facetName} As...`,
            style: { textTransform: "capitalize" },
            onClick: () => setMode(FileModalMode.SAVE)
        }
    ]
    const menuContext =
        mode === FileModalMode.NONE ? null : createElement(FileModal, { facetName, mode, onClose })

    return { menuItems, menuContext }
}
