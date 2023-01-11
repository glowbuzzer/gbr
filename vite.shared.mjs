/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import react from "@vitejs/plugin-react";
import {resolve, basename} from "path";
import svgr from "@svgr/rollup"

const dir = process.cwd()

const [, , projectDir] = process.argv

const project = basename(projectDir);
if ( !project.length ) {
    throw new Error("Vite project could not be detetermined")
}

const cacheDir = resolve(dir, "node_modules/.vite/"+ project);
console.log("Using cache dir", cacheDir)

export const DEFAULT_VITE_CONFIG = {
    cacheDir,
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            "@glowbuzzer/controls": resolve(dir, "./libs/controls/src/index.ts"),
            "@glowbuzzer/store": resolve(dir, "./libs/store/src/index.ts")
        }
    }
}
