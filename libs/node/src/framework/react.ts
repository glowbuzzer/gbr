/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Framework } from "./index"

export function useEffect(effect: Function, deps: any[]) {
    Framework.instance().addEffect(effect, deps)
}

export function useMemo(factory: Function) {
    return factory()
}

export function useState() {
    return [0, () => {}]
}

export function useRef(v) {
    return Framework.instance().ref(v)
}

export function createContext() {
    return {}
}

export function useContext(c) {
    return Framework.instance().getContext(c)
}

export default {
    useEffect,
    useMemo,
    useState,
    useRef,
    createContext,
    useContext
}
