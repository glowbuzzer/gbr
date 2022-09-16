import {defineConfig, loadEnv} from "vite"
import react from "@vitejs/plugin-react"
import {resolve} from "path";

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@glowbuzzer/controls": resolve(__dirname, "../../libs/controls/src/index.ts"),
                "@glowbuzzer/store": resolve(__dirname, "../../libs/store/src/index.ts")
            }
        }
    }
})
