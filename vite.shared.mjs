/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import react from "@vitejs/plugin-react";
import {resolve} from "path";

export const DEFAULT_VITE_CONFIG = {
    plugins: [react()],
    resolve: {
        alias: {
            "@glowbuzzer/controls": resolve(__dirname, "./libs/controls/src/index.ts"),
            "@glowbuzzer/store": resolve(__dirname, "./libs/store/src/index.ts")
        }
    }
}
