/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Framework } from "./index"

export function shallowEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false
            }
        }
        return true
    }
    if (typeof a === "object" && typeof b === "object") {
        return (
            shallowEqual(Object.keys(a), Object.keys(b)) &&
            shallowEqual(Object.values(a), Object.values(b))
        )
    }
    return a === b
}

export function useSelector(selector: Function, equalityFn?: Function) {
    return Framework.instance().addSelector(selector, equalityFn)
}

export function useDispatch() {
    return Framework.instance().store.dispatch
}
