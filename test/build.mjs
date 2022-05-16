import {Command} from "commander"
import * as esbuild from "esbuild"

const program = new Command()

program
    .option("-o, --outfile <file>", "where to generate output file (bundled script)")
    .option("-w, --watch", "build and then watch for changes")
    .option("-s, --source <file>", "specify source file")

program.parse(process.argv)
const {source, outfile, watch} = program.opts()

esbuild.build({
    define: {
        "process.env.NODE_ENV": '"production"'
    },
    // external: ["canvas"],
    watch: !!watch,
    sourcemap: true,
    target: "es2019",
    platform: "node",
    entryPoints: [source || "./index.ts"],
    bundle: true,
    outfile: outfile || "../../gbc/libs/gbc-node/build/index.js",
    plugins: [{
        name: "info",
        setup(build) {
            build.onEnd(() => console.log("Build complete", new Date().toISOString()))
        }
    }]
}).catch(() => process.exit(1))
