const path = require("path")

/** @type {import("snowpack").SnowpackConfig } */
module.exports = {
    devOptions: {
        port: 8082,
        open: "false"
    },
    mount: {
        "apps/tileapp/src": "/",
        "libs/controls/src": "/controls",
        "libs/layout/src": "/layout",
        "libs/store/src": "/store"
    },
    plugins: [
        ["snowpack-plugin-less", { javascriptEnabled: true, moduleResolution: "node_modules" }],
        "@snowpack/plugin-react-refresh",
        "@snowpack/plugin-dotenv",
        "@snowpack/plugin-babel"
    ],
    alias: {
        "@glowbuzzer/layout": "./libs/layout/src/index.ts",
        "@glowbuzzer/controls": "./libs/controls/src/index.ts",
        "@glowbuzzer/store": "./libs/store/src/index.ts"
    }
}
