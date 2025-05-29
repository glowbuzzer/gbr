/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {Application, LogLevel, TSConfigReader, TypeDocReader} from "typedoc"

function loadTypedoc(entryPoint, tsconfig) {
    const app = new Application()
    app.options.addReader(new TypeDocReader())
    app.options.addReader(new TSConfigReader())

    app.bootstrap({
        entryPoints: [entryPoint],
        tsconfig,
        // skipErrorChecking:true
        // excludeExternals: true,
        externalPattern: ["**/node_modules/**"],

    })

    try {
        const project = app.convert()

        if (project) {
            return app.serializer.projectToObject(project, process.cwd())
        } else {
            console.log("No typedoc generated!")
            return {
                children: []
            }
        }
    } catch (error) {
        throw error
    }
}

const entryPoint = "./libs/store/src/index.ts"
const tsconfig = "./tsconfig.doc.json"
console.log("Generate typedoc, entryPoint=", entryPoint, "tsconfig=", tsconfig)
loadTypedoc(entryPoint, tsconfig)
