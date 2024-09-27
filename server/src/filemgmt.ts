/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as express from "express"
import { Router } from "express"
import { ServerResponse } from "http"
import * as fs from "fs"

export type ServeStaticOptions = {
    localPath: string
}

export function configureFileManagementRouter(app: Router, options: ServeStaticOptions) {
    const { localPath } = options || {
        localPath: process.env.DYNAMIC_FILE_LOCATION || "/gb"
    }

    console.log("Serving of static files enabled. Requests to /gb will be mapped to:", localPath)
    app.use("/gb", express.static(localPath))

    app.use("/__file/:name", express.raw({ type: "application/octet-stream", limit: "100mb" }))

    function attempt(res: ServerResponse, fn) {
        try {
            const response = fn()
            res.writeHead(200)
            res.write(JSON.stringify(response))
            res.end()
        } catch (e) {
            console.log("ERROR IN FILE MANAGEMENT", e)
            res.writeHead(500)
            res.write(JSON.stringify({ success: false, error: e.message }))
            res.end()
        }
    }

    app.get("/__file", (req, res: ServerResponse) => {
        attempt(res, () => {
            // scan contents of directory in localPath
            const files = fs.readdirSync(localPath, { withFileTypes: true })
            return files
                .filter(f => f.isFile())
                .map(file => {
                    const { mtime, size } = fs.statSync(localPath + "/" + file.name)
                    return {
                        name: file.name,
                        size: size,
                        modified: mtime.getTime()
                    }
                })
        })
    })

    app.delete("/__file/:filename", (req, res: ServerResponse) => {
        attempt(res, () => {
            if (fs.existsSync(localPath + "/" + req.params.filename)) {
                fs.rmSync(localPath + "/" + req.params.filename)
            }
            return { success: true }
        })
    })

    app.post("/__file/:filename", (req, res: ServerResponse) => {
        attempt(res, () => {
            fs.writeFileSync(localPath + "/" + req.params.filename, req.body)
            return { success: true }
        })
    })
}
