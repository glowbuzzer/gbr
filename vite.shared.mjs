/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import react from "@vitejs/plugin-react";
import {resolve} from "path";

const dir=process.cwd()

export const DEFAULT_VITE_CONFIG = {
    plugins: [react()],
    resolve: {
        alias: {
            "@glowbuzzer/controls": resolve(dir, "./libs/controls/src/index.ts"),
            "@glowbuzzer/store": resolve(dir, "./libs/store/src/index.ts")
        }
    }
}
