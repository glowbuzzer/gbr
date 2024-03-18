/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { AnyAction, Slice } from "@reduxjs/toolkit"
import { Reducer } from "react"

type OverrideableStateWithArray<V> = V[] & {
    $override?: V[]
}

/**
 * A higher order reducer that supports slices which consist only of an array of values (such as inputs), and allows
 * overriding individual values in the inputs array. This can be useful during development to simulate inputs from GBC
 * rather than rely on physical inputs.
 */
export const overrideable = <V>(
    slice: Slice<OverrideableStateWithArray<V>>
): Reducer<OverrideableStateWithArray<V>, AnyAction> => {
    return (state, action: AnyAction): OverrideableStateWithArray<V> => {
        const override = state?.$override || []
        const next = slice.reducer(state, action)
        if (state && action.type.startsWith(slice.name + "/$OVERRIDE/")) {
            if (action.type === `${slice.name}/$OVERRIDE/$CLEAR`) {
                const { $override, ...rest } = next
                return rest
            }
            if (action.type === `${slice.name}/$OVERRIDE/$SET`) {
                const { index, value } = action.payload
                override[index] = value
            }
        }
        if (override.length) {
            const result_with_override: OverrideableStateWithArray<V> = next.map((v, index) =>
                override[index] !== undefined ? override[index] : v
            )
            result_with_override.$override = override
            return result_with_override
        }
        return next
    }
}

export function createOverrideSetAction<V>(
    slice: Slice<OverrideableStateWithArray<V>>,
    index: number,
    value: V
) {
    return {
        type: `${slice.name}/$OVERRIDE/$SET`,
        payload: {
            index,
            value
        }
    }
}

export function createOverrideClearAction<V>(slice: Slice<OverrideableStateWithArray<V>>) {
    return {
        type: `${slice.name}/$OVERRIDE/$CLEAR`,
        payload: {}
    }
}
