/**
 * Script to create template.json (required by CRA) from dependencies.json (custom glowbuzzer file)
 *
 * Dependencies with a version of 'detect' will be replaced with current version used by package.json in the root of the gbr project.
 *
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 *
 */

import fs from "fs"

const [, , project, gbr_version] = process.argv

if (!project) {
    console.error("Missing project name")
    process.exit(1)
}

if (!gbr_version) {
    console.error("Missing gbr version")
    process.exit(1)
}

const text = fs.readFileSync(project + "/dependencies.json").toString()

const json = JSON.parse(text)
const base_versions = {
    ...JSON.parse(fs.readFileSync("../package.json").toString()).dependencies,
    "@glowbuzzer/store": gbr_version,
    "@glowbuzzer/controls": gbr_version
}

// noinspection JSCheckFunctionSignatures
const dependencies = Object.fromEntries(Object.entries(json).map(([name, version]) => {
    if (version === "detect") {
        const base_version = base_versions[name]
        if (!base_version) {
            console.error(`Missing base version for ${name}`)
            process.exit(1)
        }
        return [name, base_version]
    }
    return [name, version]
}))

const template = {
    "package": {
        dependencies,
        "eslintConfig": {
            "extends": [
                "react-app"
            ]
        }
    }
}

fs.writeFileSync(project + "/template.json", JSON.stringify(template, null, 2))

// write package.json with new version using package.json.src as the template
const package_json = JSON.parse(fs.readFileSync(project + "/package.json.src").toString())
package_json.version = gbr_version
fs.writeFileSync(project + "/package.json", JSON.stringify(package_json, null, 2))
