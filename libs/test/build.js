let exampleOnResolvePlugin = {
    name: "example",
    setup(build) {
        const path = require("path")

        build.onResolve({ filter: /gbc-node/ }, args => {
            console.log("RESOLVE", args.path)
            return {
                path: args.path,
                external: true
            }
        })

        // build.onLoad({ filter: /gbc-node/ }, args => {
        //     console.log("REWRITE GBC NODE")
        //     return {
        //         contents: "",
        //         loader: "js"
        //     }
        // })
        // // Redirect all paths starting with "images/" to "./public/images/"
        // build.onResolve({ filter: /^images\// }, args => {
        //     return { path: path.join(args.resolveDir, "public", args.path) }
        // })
        //
        // // Mark all paths starting with "http://" or "https://" as external
        // build.onResolve({ filter: /^https?:\/\// }, args => {
        //     return { path: args.path, external: true }
        // })
    }
}

require("esbuild")
    .build({
        define: {
            "process.env.NODE_ENV": "\"production\""
        },
        // external: ["canvas"],
        watch: true,
        sourcemap: true,
        target: "es2019",
        platform: "node",
        entryPoints: ["./index.ts"],
        bundle: true,
        outfile: "../../../monorepo/libs/gbc-node/build/index.js",
        plugins: [exampleOnResolvePlugin]
    })
    .then(() => console.log("Build complete"))
    .catch(() => process.exit(1))
