/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { defineConfig, normalizePath } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "@svgr/rollup"
import { viteStaticCopy } from "vite-plugin-static-copy"
import { viteDracoPlugin } from "./awlib/src/vite-draco-plugin"
import { basename, resolve } from "path"
import { serveStatic } from "./static-file-plugin"

const root = process.cwd()
const [, , projectDir] = process.argv
const project = basename(projectDir)

const cacheDir = resolve(root, "node_modules/.vite/" + project)
console.log("Using cache dir", cacheDir)

export default function defineAutomationWareViteConfig(config = { port: 5175 }) {
    return defineConfig({
        server: {
            host: true,
            port: config.port
        },
        envDir: root, // load config from project root
        cacheDir,
        plugins: [
            react(),
            svgr(),
            viteDracoPlugin(),
            viteStaticCopy({
                targets: [
                    {
                        src: normalizePath(resolve(root, "examples/assets/environment")),
                        dest: "./assets"
                    }
                ]
            }),
            serveStatic()
        ],
        resolve: {
            alias: {
                "@glowbuzzer/controls": resolve(root, "./libs/controls/src/index.ts"),
                "@glowbuzzer/store": resolve(root, "./libs/store/src/index.ts"),
                "@glowbuzzer/awlib": resolve(root, "./vendors/automationware/awlib/src/index.ts")
            }
        }
    })
}
