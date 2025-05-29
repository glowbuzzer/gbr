/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useLocalStorage } from "../util/LocalStorageHook"

export enum DismissType {
    NOT_DISMISSIBLE,
    REQUIRE_RESET,
    DISMISSABLE,
    MINIMIZABLE
}

type StatusTrayRegisteredItem = {
    id: string
    dismissable: DismissType
}

type StatusTrayContextType = {
    registerItem(id: string, dismissable: DismissType): void
    unregisterItem(id: string): void
    dismissItem(id: string): void
    undismissAll(): void
    dismissed: string[]
    trayVisible: boolean
    statusBarElement: HTMLDivElement
}

const statusTrayContext = createContext<StatusTrayContextType>(null)

const EMPTY_ARRAY: string[] = []

/**
 * Provider for the status tray. Tracks whether any items are visible and which items have been dismissed.
 * StatusTrayItem components register themselves with this provider. It's important that we don't go into a
 * re-render loop when descendents register themselves, hence heavy use of useCallback and useMemo.
 */
export const StatusTrayProvider = ({ statusBarElement = null, children }) => {
    const [items, setItems] = useState<{ [index: string]: StatusTrayRegisteredItem }>({})
    const [dismissed, setDismissed] = useLocalStorage("status.tray.dismissed.items", EMPTY_ARRAY)

    const registerItem = useCallback((id: string, dismissable: DismissType) => {
        setItems(items => ({
            ...items,
            [id]: {
                id,
                dismissable
            }
        }))
    }, [])

    const unregisterItem = useCallback((id: string) => {
        setItems(items => {
            const { [id]: _, ...next } = items
            return next
        })
    }, [])

    const dismissItem = useCallback((id: string) => {
        setDismissed(dismissed => [...dismissed.filter(d => d !== id), id])
    }, [])

    const undismissAll = useCallback(() => {
        setDismissed(EMPTY_ARRAY)
    }, [])

    const trayVisible = useMemo(() => {
        return Object.keys(items).some(id => !dismissed.includes(id))
    }, [items, dismissed])

    const context: StatusTrayContextType = useMemo(
        () => ({
            registerItem,
            unregisterItem,
            dismissItem,
            dismissed,
            undismissAll,
            trayVisible,
            statusBarElement
        }),
        [registerItem, unregisterItem, dismissItem, dismissed, undismissAll, trayVisible]
    )

    return <statusTrayContext.Provider value={context}>{children}</statusTrayContext.Provider>
}

/**
 * Returns true if any items are visible in the status tray.
 */
export function useStatusTrayVisible(): boolean {
    const context = useContext(statusTrayContext)
    return context.trayVisible
}

/**
 * Returns the list of dismissed items and a function to show all items.
 */
export function useStatusTrayDismissedItems(): Pick<
    StatusTrayContextType,
    "dismissed" | "undismissAll"
> {
    return useContext(statusTrayContext)
}

/**
 * Returns the status tray context for a specific item.
 * @param id The id of the status tray item.
 */
export function useStatusTray(id: string) {
    const context = useContext(statusTrayContext)
    const dismissed = context.dismissed.includes(id)

    return useMemo(() => {
        return { ...context, visible: !dismissed }
    }, [id, dismissed])
}

export function useStatusBarElement() {
    const context = useContext(statusTrayContext)
    return context.statusBarElement
}
