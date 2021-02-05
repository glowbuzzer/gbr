/** @type {import("snowpack").SnowpackConfig } */
module.exports = {
    mount: {
        "apps/cartmc/src": "/",
        "libs/controls/src": "/controls",
        "libs/layout/src": "/layout",
        "libs/store/src": "/store"
    },
    plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-dotenv", "@snowpack/plugin-babel" /*, "@snowpack/plugin-optimize"*/],
    install: [
        /* ... */
    ],
    installOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
    },
    proxy: {
        /* ... */
    },
    alias: {
        "@glowbuzzer/layout": "./libs/layout/src/index.ts",
        "@glowbuzzer/controls": "./libs/controls/src/index.ts",
        "@glowbuzzer/store": "./libs/store/src/index.ts"
    }
}
