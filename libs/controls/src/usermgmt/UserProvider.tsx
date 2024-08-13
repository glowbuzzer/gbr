/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React, { createContext, useState } from "react"
import { GlowbuzzerDimmerStyle } from "../app"
import { UserLoginModal } from "./UserLoginModal"
import { UserModel, UserProfile } from "./types"
import { ADMIN_ROLE_NAME } from "./util"
import { UserDatabaseProvider } from "./UserDatabaseProvider"

type UserContextType = {
    model: UserModel
    enabled: boolean
    currentUser: UserProfile
    capabilities: symbol[]
    logout(): void
    showAnonymousLogin(): void
}

const UserContext = createContext<UserContextType>(null)

type UserProviderProps = {
    model?: UserModel
    children: React.ReactNode
}

export const UserProvider = ({ model, children }: UserProviderProps) => {
    const [anonymousLogin, setAnonymousLogin] = useState(false)

    const anonymousRole = model?.anonymousRole
        ? model.roles.find(r => r.name === model.anonymousRole)
        : null

    if (model?.anonymousRole && !anonymousRole) {
        throw new Error(
            `Anonymous role '${model.anonymousRole}' not found in list of roles defined`
        )
    }

    if (model && !model.roles.some(r => r.name === ADMIN_ROLE_NAME)) {
        throw new Error("User role model must have a role with the name 'admin'")
    }

    const initialState = {
        user: null,
        capabilities: anonymousRole?.capabilities || []
    }

    const [state, setState] = useState<{ user: UserProfile; capabilities: symbol[] }>(initialState)

    function login(user: UserProfile) {
        const capabilities: symbol[] = user.roles.reduce((acc, role) => {
            const roleDef = model.roles.find(r => r.name === role)
            if (roleDef) {
                acc.push(...roleDef.capabilities)
            }
            return acc
        }, [])

        setState({
            user,
            capabilities
        })
        setAnonymousLogin(false)
    }

    const enabled = !!model
    const context: UserContextType = {
        model,
        enabled,
        currentUser: state.user,
        capabilities: state.capabilities,
        logout() {
            setState(initialState)
        },
        showAnonymousLogin() {
            setAnonymousLogin(true)
        }
    }

    const show_login = enabled && !state.user && (!model.anonymousRole || anonymousLogin)
    return (
        <UserDatabaseProvider>
            {show_login && (
                <UserLoginModal
                    onLogin={login}
                    onCancel={anonymousLogin ? () => setAnonymousLogin(false) : undefined}
                />
            )}
            <UserContext.Provider value={context}>{children}</UserContext.Provider>
        </UserDatabaseProvider>
    )
}

export function useUser() {
    const context = React.useContext(UserContext)
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}

export function useUserModel() {
    const { model } = useUser()
    return model
}
