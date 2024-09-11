/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { test, expect } from "vitest"
import { find_safe_z, is_near_singularity, values } from "./singularities"
import { Vector3 } from "three"

// @ts-ignore
import singularities from "./singularities.json"

const { minAxis, maxAxis, step, data } = singularities
const mid = (maxAxis - minAxis) / 2 / step
const count = (maxAxis - minAxis) / step + 1

test("specific point in space", () => {
    const x = 200 / 50 + mid
    const y = mid
    const z = 1050 / step + mid

    const n = x + y * count + z * count * count
    expect(values[n]).toBe(true)

    const z2 = z - 1
    const n2 = x + y * count + z2 * count * count
    expect(values[n2]).toBe(false)
})

test("it should not move the lift if not necessary", () => {
    const z = find_safe_z(new Vector3(200, 0, 200))
    expect(z).toBe(200)
})

test("it should lower the lift when necessary (close to base)", () => {
    const z = find_safe_z(new Vector3(200, 0, 10000))
    expect(z).toBe(950)
})

test("it should raise the lift when necessary (close to base)", () => {
    const z = find_safe_z(new Vector3(200, 0, -10000))
    expect(z).toBe(-1600)
})

test("it find its way out of the inner sphere singularity (close to base)", () => {
    const z = find_safe_z(new Vector3(200, 0, -350))
    expect(z).toBe(-450)
})

test("it find its way out of the inner sphere singularity (upwards)", () => {
    const z = find_safe_z(new Vector3(600, 0, -550))
    expect(z).toBe(-400)
})

test("it find its way out of the inner sphere singularity (downwards)", () => {
    const z = find_safe_z(new Vector3(500, 0, -550))
    expect(z).toBe(-750)
})
