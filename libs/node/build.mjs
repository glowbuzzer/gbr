/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { Command } from "commander";
import * as esbuild from "esbuild";
import {spawn} from "child_process";

const program = new Command();

program
    .option("-o, --outfile <file>", "where to generate output file (bundled script)")
    .option("-w, --watch", "build and then watch for changes")
    .option("-s, --source <file>", "specify source file");

program.parse(process.argv);
const { source, outfile, watch } = program.opts();

const options = {
    define: {
        "process.env.NODE_ENV": "\"production\""
    },
    sourcemap: true,
    target: "es2019",
    platform: "node",
    entryPoints: [source || "./src/node.spec.ts"],
    bundle: true,
    outfile: outfile || "./dist/index.js",
    alias: {
        "react": "./src/framework/react",
        "react-redux": "./src/framework/react-redux"
    },
    plugins: [{
        name: "info",
        setup(build) {
            build.onEnd(() => {
                console.log("\n\n\nBuild complete\n\n", new Date().toISOString());
                // fork node process to run the tests
                const child = spawn("node", ["./dist/index.js"]);
                // pipe the output to the console
                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
            });
        }
    }]
};


if (watch) {
    esbuild.context(options).then(async c => {
        await c.watch();
    });
} else {
    esbuild.build(options).catch(() => process.exit(1));
}
