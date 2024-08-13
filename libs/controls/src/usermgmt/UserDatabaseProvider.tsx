/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React, { createContext, useContext, useEffect, useState } from "react"
import { UserProfile } from "./types"
import { hashPassword } from "./UserLoginModal"
import { ADMIN_ROLE_NAME } from "./util"
import { useConnectionUrls } from "../app/hooks"

type UserDatabaseContextType = {
    users: UserProfile[]
    addUser(user: { username: string; password: string }): Promise<void>
    deleteUser(user: UserProfile): Promise<void>
    setRoles(user: UserProfile, roles: string[]): Promise<void>
    setPassword(user: UserProfile, password: string): Promise<void>
}

const UserDatabaseContext = createContext<UserDatabaseContextType>(null)

export const UserDatabaseProvider = ({ children }) => {
    const { pouchDbBase } = useConnectionUrls()
    const [database, setDatabase] = useState<PouchDB.Database<UserProfile>>(null)
    const [users, setUsers] = useState<UserProfile[]>([])

    useEffect(() => {
        if (database) {
            database.allDocs({ include_docs: true }).then(docs => {
                const fetched_users = docs.rows.map(row => row.doc)
                if (!fetched_users.some(user => user._id === "admin")) {
                    const admin_user = {
                        _id: "admin",
                        _rev: null,
                        roles: [ADMIN_ROLE_NAME],
                        password: "9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0" // 0000 hashed
                    }
                    database.put(admin_user).then(() => {
                        setUsers([admin_user, ...fetched_users])
                    })
                } else {
                    setUsers(fetched_users)
                }
            })
        }
        // TODO: error handling in case of db issue
    }, [database])

    useEffect(() => {
        window.global = window
        import("pouchdb")
            .then(PouchDB => {
                // TODO: remote db
                setDatabase(new PouchDB.default(`${pouchDbBase}$users`))
            })
            .catch(err => {
                console.error(err)
            })
    }, [])

    const context: UserDatabaseContextType = {
        users,
        async addUser(user: { username: string; password: string }) {
            const { username, password } = user
            const hashed_password = await hashPassword(password)
            const doc = {
                _id: username,
                _rev: null,
                // SHA256 hash the password
                password: hashed_password,
                roles: []
            }
            const result = await database.put(doc)
            setUsers([...users, { ...doc, _rev: result.rev }])
        },
        async deleteUser(user: UserProfile) {
            await database.remove(user)
            setUsers(users.filter(u => u._id !== user._id))
        },
        async setRoles(user: UserProfile, roles: string[]) {
            const doc = { ...user, roles }
            const response = await database.put(doc)
            setUsers(users.map(u => (u._id === user._id ? { ...doc, _rev: response.rev } : u)))
        },
        async setPassword(user: UserProfile, password: string) {
            const hashed_password = await hashPassword(password)
            const doc = { ...user, password: hashed_password }
            const response = await database.put(doc)
            setUsers(users.map(u => (u._id === user._id ? { ...doc, _rev: response.rev } : u)))
        }
    }
    return <UserDatabaseContext.Provider value={context}>{children}</UserDatabaseContext.Provider>
}

export function useUserDatabase() {
    const context = useContext(UserDatabaseContext)
    if (!context) {
        throw new Error("useUserDatabase must be used within a UserDatabaseProvider")
    }
    return context
}
