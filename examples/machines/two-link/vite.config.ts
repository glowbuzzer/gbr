/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { normalizePath } from "vite"
import { defineExampleViteConfig } from "../../vite.shared"
import path from "path"

export default defineExampleViteConfig({
    customAssets: {
        ".": "./node_modules/occt-import-js/dist/occt-import-js.wasm"
    }
})
