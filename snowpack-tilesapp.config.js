const path = require("path")

/** @type {import("snowpack").SnowpackConfig } */
module.exports = {
    mount: {
        "apps/tileapp/src": "/",
        "libs/controls/src": "/controls",
        "libs/layout/src": "/layout",
        "libs/store/src": "/store"
    },
    plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-dotenv", "@snowpack/plugin-babel"],
    alias: {
        "@glowbuzzer/layout": "./libs/layout/src/index.ts",
        "@glowbuzzer/controls": "./libs/controls/src/index.ts",
        "@glowbuzzer/store": "./libs/store/src/index.ts"
    },
    devOptions: {
        port: 8083,
        open: "none"
    }
}
