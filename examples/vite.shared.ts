/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import react from "@vitejs/plugin-react"
import { resolve, basename } from "path"
import { normalizePath } from "vite"
import svgr from "@svgr/rollup"
import { viteStaticCopy } from "vite-plugin-static-copy"

const root = process.cwd()

const [, , projectDir] = process.argv

const project = basename(projectDir)
if (!project.length) {
    throw new Error("Vite project could not be detetermined")
}

const cacheDir = resolve(root, "node_modules/.vite/" + project)
console.log("Using cache dir", cacheDir)

type ExampleViteConfigOptions = {
    sharedAssetDirectories?: string[]
    customAssets?: { [index: string]: string }
    aliases?: { [index: string]: string }
}

export function defineExampleViteConfig(options: ExampleViteConfigOptions = {}) {
    const shared = options.sharedAssetDirectories || ["environment"]

    const targets = [
        {
            src: normalizePath(resolve(root, "images/tiny-logo.svg")),
            dest: "./assets"
        },
        ...shared.map(name => ({
            src: normalizePath(resolve(root, "examples/assets/" + name + "/**")),
            dest: "./assets/" + name
        })),
        ...Object.entries(options.customAssets || {}).map(([dest, src]) => ({
            src: normalizePath(resolve(root, src)),
            dest
        }))
    ]

    return {
        cacheDir,
        plugins: [
            react(),
            svgr(),
            viteStaticCopy({
                targets
            })
        ],
        resolve: {
            alias: {
                "@glowbuzzer/controls": resolve(root, "./libs/controls/src/index.ts"),
                "@glowbuzzer/store": resolve(root, "./libs/store/src/index.ts"),
                ...Object.fromEntries(
                    Object.entries(options.aliases || {}).map(([k, v]) => [k, resolve(root, v)])
                )
            }
        },
        define: {
            "window.global": "window"
        }
    }
}
