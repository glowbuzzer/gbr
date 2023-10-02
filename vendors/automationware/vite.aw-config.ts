/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { defineConfig, normalizePath } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "@svgr/rollup"
import { viteStaticCopy } from "vite-plugin-static-copy"
import { basename, resolve } from "path"

const root = process.cwd()
const [, , projectDir] = process.argv
const project = basename(projectDir)

const cacheDir = resolve(root, "node_modules/.vite/" + project)
console.log("Using cache dir", cacheDir)

export default function defineAutomationWareViteConfig() {
    return defineConfig({
        cacheDir,
        plugins: [
            react(),
            svgr(),
            viteStaticCopy({
                targets: [
                    {
                        src: normalizePath(resolve(root, "examples/assets/environment")),
                        dest: "./assets"
                    },
                    {
                        src: normalizePath(resolve(root, "vendors/automationware/assets/awtube")),
                        dest: "./assets"
                    }
                ]
            })
        ],
        resolve: {
            alias: {
                "@glowbuzzer/controls": resolve(root, "./libs/controls/src/index.ts"),
                "@glowbuzzer/store": resolve(root, "./libs/store/src/index.ts"),
                "@automationware/awtube": resolve(
                    root,
                    "./vendors/automationware/lib/awtube/index.ts"
                )
            }
        }
    })
}
