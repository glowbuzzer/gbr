/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { resolve } from "path"
import svgr from "@svgr/rollup"

/**
 * This file is only used during glowbuzzer development. Using this file,
 * we can use the local version of the glowbuzzer libraries instead of the
 * published versions.
 */

const root = process.cwd()

export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            "@glowbuzzer/controls": resolve(root, "./libs/controls/src/index.ts"),
            "@glowbuzzer/store": resolve(root, "./libs/store/src/index.ts")
        }
    }
})
