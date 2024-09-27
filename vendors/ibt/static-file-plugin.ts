/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as fs from "fs"
import { Plugin } from "vite"
import { configureFileManagementRouter, ServeStaticOptions } from "../../server/src/filemgmt"
import { Router } from "express"

export function serveStatic(options?: ServeStaticOptions): Plugin {
    return {
        name: "serve-custom-static",
        configureServer(server) {
            const router = Router()
            configureFileManagementRouter(router, options)
            server.middlewares.use(router)

            // server.middlewares.use((req, res, next) => {
            //     if (req.url.startsWith("/gb/")) {
            //         const filePath = req.url.replace(
            //             "/gb/",
            //             process.env.GB_STATIC_PATH_MAPPING || "/gb/"
            //         )
            //         const stats = fs.statSync(filePath, { throwIfNoEntry: false })
            //
            //         if (!stats || !stats.isFile()) {
            //             console.log("Static file not found:", filePath)
            //             res.writeHead(404)
            //             res.end("Not found: " + filePath)
            //             return
            //         }
            //
            //         res.writeHead(200, {
            //             "Content-Length": stats.size
            //         })
            //
            //         const stream = fs.createReadStream(filePath)
            //         stream.pipe(res)
            //     } else {
            //         next()
            //     }
            // })
        }
    }
}
