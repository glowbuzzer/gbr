/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { RGB } from "three"
import { ObjectType } from "./store"

type Entry = {
    r: number
    g: number
    b: number
    weight: number
}

const QUANTIZE_SIZE = 64

function quantize_raw(col: RGB, size: number): RGB {
    const r = Math.round(col.r / size) * size
    const g = Math.round(col.g / size) * size
    const b = Math.round(col.b / size) * size
    console.log("in", col, "out", { r, g, b })
    return { r, g, b }
}

function quantize(entry: Entry, size = QUANTIZE_SIZE): RGB {
    return quantize_raw(entry, size)
}

function distance(a: Entry, r: number, g: number, b: number) {
    return Math.sqrt(Math.pow(a.r - r, 2) + Math.pow(a.g - g, 2) + Math.pow(a.b - b, 2))
}

export function dominant_color(pixels: Uint8Array, width: number, height: number) {
    const entries: Entry[] = []
    loop: for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const n = (x * height + y) * 4
            const r = pixels[n]
            const g = pixels[n + 1]
            const b = pixels[n + 2]

            // const { r, g, b } = quantize({ r: rx, g: gx, b: bx })

            const distance_from_centre = Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2)
            // calculate the max deviation from the mean of the rgb values
            const mean = (r + g + b) / 3
            const deviation = Math.max(Math.abs(r - mean), Math.abs(g - mean), Math.abs(b - mean))

            // const monotone = Math.min(r, g, b) / Math.max(r, g, b)
            const weight = (1 / (1 + distance_from_centre)) * deviation * 1000

            for (const e of entries) {
                if (distance(e, r, g, b) < 40) {
                    e.weight += weight
                    continue loop
                }
            }
            // got to the end, add a new entry
            entries.push({
                r,
                g,
                b,
                weight
            })
        }
    }
    entries.sort((a, b) => b.weight - a.weight)
    const reduced = entries.reduce((acc, e) => {
        const { r, g, b } = quantize(e)
        const existing = acc.find(e => distance(e, r, g, b) < 100)
        if (existing) {
            existing.weight += e.weight
        } else {
            acc.push({ r, g, b, weight: e.weight })
        }
        return acc
    }, [])
    reduced.forEach(({ r, g, b }) => {
        const color = `rgb(${r}, ${g}, ${b})` // Change the RGB values to the color you want to display
        console.log("%c   ", "background: " + color + ";")
    })
    return reduced[0]
}

export function to_object_type(color: RGB) {
    const { r, g, b } = quantize_raw(color, 128)

    if (r === 256 && g === 256) {
        return ObjectType.DUCK
    }
    return ObjectType.CAR
}
