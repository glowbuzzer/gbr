/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { shallowEqual } from "./react-redux"
import { log } from "./log"

type FunctionSideEffect = {
    effect: Function
    cleanup?: Function
    deps: any[]
    dirty: boolean
}

type FunctionSelector = {
    function: Function
    value: any
    equalityFn: Function
}

type RegisteredFunction = {
    func: Function
    selectors: FunctionSelector[]
    effects: FunctionSideEffect[]
    refs: any[]
}

export class Framework {
    readonly store: any
    private functions: Map<Function, RegisteredFunction> = new Map()
    private static _instance: Framework
    private _current: RegisteredFunction = null
    private _registering = false
    private indexes = {
        selector: 0,
        ref: 0,
        effect: 0
    }
    private context = {}

    private constructor(store) {
        this.store = store
        store.subscribe(this.update.bind(this))
    }

    static create(store) {
        if (this._instance) {
            throw new Error("Framework already initialized")
        }
        this._instance = new Framework(store)
        return this._instance
    }

    static instance() {
        if (!this._instance) {
            throw new Error("Framework not initialized")
        }
        return this._instance
    }

    private exec(func: Function) {
        for (const key in this.indexes) {
            this.indexes[key] = 0
        }
        return func()
    }

    update() {
        this.functions.forEach(item => {
            const modified = this.processSelectors(item)
            if (modified) {
                try {
                    this._current = item
                    this.exec(item.func)
                } finally {
                    this._current = null
                }
                this.processEffects(item)
            }
        })
    }

    private processSelectors(item: RegisteredFunction) {
        const { selectors } = item
        for (const selector of selectors) {
            const new_value = selector.function(this.store.getState())
            const equals = selector.equalityFn
                ? selector.equalityFn(selector.value, new_value)
                : selector.value === new_value

            if (!equals) {
                return true
            }
        }
        return false
    }

    private processEffects(item: RegisteredFunction) {
        const { effects } = item
        for (const e of effects) {
            if (e.dirty) {
                e.cleanup?.()
                e.dirty = false
                e.cleanup = e.effect()
            }
        }
    }

    register(func: Function) {
        const item = {
            func,
            selectors: [],
            effects: [],
            refs: []
        }
        this.functions.set(func, item)
        try {
            this._current = item
            this._registering = true
            func()
            this.update()
        } catch (e) {
            console.error("Error in function during registration", e)
        } finally {
            this._current = null
            this._registering = false
        }
    }

    addSelector(selector: Function, equalityFn?: Function) {
        const f = this._current
        if (!f) {
            throw new Error("Selector called outside of update or registration!")
        }
        const value = selector(this.store.getState())
        if (this._registering) {
            // registration
            const item = { function: selector, value, equalityFn }
            f.selectors.push(item)
        } else {
            if (this.indexes.selector >= f.selectors.length) {
                throw new Error("Selector called more times than registered!")
            }
            const item = f.selectors[this.indexes.selector++]
            item.value = value
        }
        return value
    }

    ref(defaultValue: any) {
        const f = this._current
        if (!f) {
            throw new Error("Ref called outside of update or registration!")
        }
        if (this._registering) {
            // registration
            const item = { current: defaultValue }
            f.refs.push(item)
            return item
        } else {
            if (this.indexes.ref >= f.refs.length) {
                throw new Error("Ref called more times than registered!")
            }
            return f.refs[this.indexes.ref++]
        }
    }

    addContext<T>(context, impl: T) {
        this.context[context] = impl
    }

    getContext<T>(context): T {
        return this.context[context] || {}
    }

    addEffect(effect: Function, deps: any[]) {
        const f = this._current
        const e = f.effects[this.indexes.effect++]
        if (!e) {
            const item = {
                effect: effect,
                deps,
                dirty: true
            }
            f.effects.push(item)
        } else {
            if (!shallowEqual(e.deps, deps)) {
                e.effect = effect
                e.deps = deps
                e.dirty = true
            }
        }
    }
}
