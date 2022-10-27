/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {readdir, readFile, stat} from "fs/promises";
import {join} from "path";
import {parse} from "react-docgen"

async function loadDocgen(path) {
    let result = true
    const files = await readdir(path)
    for (const f of files) {
        const next = join(path, f)
        const info = await stat(next)
        if (info.isDirectory()) {
            result &= await loadDocgen(next)
        } else if (next.endsWith(".tsx")) {
            const src = await readFile(next)
            try {
                const r = parse(src, null, null, {filename: next})
            } catch (e) {
                console.log(e.message, "In file:", next)
                result = false
            }
        }
    }
    return result
}

const result = await loadDocgen("./libs/controls/src")
console.log(result ? "No issues found" : "Errors found")
if (!result) {
    process.exit(1)
}
