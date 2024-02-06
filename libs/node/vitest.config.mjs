/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths({
        root: "../..",
        parseNative: true
    })],

})
