/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {defineConfig} from "vite"
import {DEFAULT_VITE_CONFIG} from "../../vite.shared.mjs";

import {viteStaticCopy} from 'vite-plugin-static-copy'
import {normalizePath} from 'vite'
import path from "path"

const src = normalizePath(path.resolve(__dirname, '../../node_modules/occt-import-js/dist/occt-import-js.wasm'))

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(() => {
    return {
        ...DEFAULT_VITE_CONFIG,
        plugins: [
            ...DEFAULT_VITE_CONFIG.plugins,
            viteStaticCopy({
                targets: [
                    {
                        src,
                        dest: '/'
                    }
                ]
            })
        ]
    };
})
