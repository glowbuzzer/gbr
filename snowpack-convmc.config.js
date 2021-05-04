/** @type {import("snowpack").SnowpackConfig } */
module.exports = {
    mount: {
        "apps/convmc/src": "/",
        "libs/controls/src": "/controls",
        "libs/layout/src": "/layout",
        "libs/store/src": "/store"
    },
    routes: [{ match: "routes", src: ".*", dest: "/index.html" }],
    plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-dotenv", "@snowpack/plugin-babel"],
    alias: {
        "@glowbuzzer/layout": "./libs/layout/src/index.ts",
        "@glowbuzzer/controls": "./libs/controls/src/index.ts",
        "@glowbuzzer/store": "./libs/store/src/index.ts"
    },
    devOptions: {
        open: "none",
        port: 8082
    }
}
