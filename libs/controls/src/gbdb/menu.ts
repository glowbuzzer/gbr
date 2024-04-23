/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { FileModal, FileModalMode, useGbdb } from "."
import { createElement, useState } from "react"
import { useGbdbFacet } from "@glowbuzzer/store"

export function useGbdbMenu(facetName: string, allowExternal = false) {
    const [mode, setMode] = useState<FileModalMode>(FileModalMode.NONE)
    const facet = useGbdbFacet(facetName)
    const { save } = useGbdb()

    function onClose() {
        setMode(FileModalMode.NONE)
    }

    function download() {
        const element = document.createElement("a")
        const file = new Blob([JSON.stringify(facet)], { type: "application/json" })
        element.href = URL.createObjectURL(file)
        element.download = `${facetName}.json`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
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
        },
        ...(allowExternal
            ? [
                  {
                      key: `${facetName}-divider`,
                      type: "divider"
                  },
                  {
                      key: `${facetName}-download`,
                      label: `Download ${facetName}`,
                      style: { textTransform: "capitalize" },
                      onClick: download,
                      disabled: !facet._id
                  }
              ]
            : [])
    ]
    const menuContext =
        mode === FileModalMode.NONE
            ? null
            : createElement(FileModal, { facetName, mode, allowExternal, onClose })

    return { menuItems, menuContext }
}
