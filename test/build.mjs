/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Command } from "commander"
import * as esbuild from "esbuild"

const program = new Command()

program
    .option("-o, --outfile <file>", "where to generate output file (bundled script)")
    .option("-w, --watch", "build and then watch for changes")
    .option("-s, --source <file>", "specify source file")

program.parse(process.argv)
const { source, outfile, watch } = program.opts()

const options = {
    define: {
        "process.env.NODE_ENV": '"production"'
    },
    sourcemap: true,
    target: "es2019",
    platform: "node",
    entryPoints: [source || "./index.ts"],
    bundle: true,
    outfile: outfile || "../../../clion/gbc/libs/gbc-node/build/index.js",
    plugins: [
        {
            name: "info",
            setup(build) {
                build.onEnd(() => console.log("Build complete", new Date().toISOString()))
            }
        }
    ]
}

if (watch) {
    esbuild.context(options).then(async c => {
        await c.watch()
    })
} else {
    esbuild.build(options).catch(() => process.exit(1))
}
