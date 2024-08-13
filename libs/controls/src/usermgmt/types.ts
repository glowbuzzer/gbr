/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

export type UserProfile = {
    _id: string
    _rev: string
    password: string // SHA-256 hash
    roles: string[]
}

export type UserCapabilityDefinition = {
    name: symbol
    description: string
} & UppercaseKeys<Record<string, symbol>>

type UppercaseKeys<T> = {
    [K in keyof T as Uppercase<K & string>]: symbol
}

export type UserRoleDefinition = {
    name: string
    capabilities: symbol[]
}

export type UserModel = {
    anonymousRole?: string
    roles: UserRoleDefinition[]
}
