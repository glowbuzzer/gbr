/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import transform from "gltfjsx/src/utils/transform.js";
import fs from "fs";
import path from "path";

function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) view[i] = buf[i];
    return ab;
}

function roundOff(value) {
    return Math.round(value * 100) / 100;
}

const [, , root] = process.argv;

function output_paths(file) {
    const {name, dir}= path.parse(file);
    const rel=path.normalize(dir).split(path.sep).slice(2).join(path.sep)
    const glb = path.join(dir, name+"-transformed.glb").replace(/\\/g, "/");
    const output_dir= path.join("awlib/src/scene/parts", rel);
    const ts = path.join(output_dir, name+".ts").replace(/\\/g, "/");

    fs.mkdirSync(output_dir, {recursive: true})

    return {
        name,
        dir,
        glb,
        ts
    }
}

async function process_file(file) {
    const {glb, ts}=output_paths(file);

    // transform (optimise) the input gltf/glb file
    // (note that this must not be compressed using draco!)
    await transform(file, glb, {});

    const data = fs.readFileSync(glb);
    // delete the temporary file
    fs.unlinkSync(glb)

    fs.writeFileSync(ts, `export default "${data.toString("base64")}"`)
}

function process_recursively(dir) {
    const files = fs.readdirSync(dir);
    return Promise.all(files.map(file => {
        const full_path = path.join(dir, file);
        const stat = fs.statSync(full_path);
        if (stat.isDirectory()) {
            return process_recursively(full_path);
        } else {
            return process_file(full_path);
        }
    }))
}

if ( !fs.existsSync("awlib/src/scene") ) {
    console.log("Please run this script from 'automationware' folder!")
    console.log("Usage: node gltfjsx.mjs <assets directory>")
    process.exit(1)
}

if ( !root?.length ) {
    console.log("Usage: node gltfjsx.mjs <assets directory>")
    process.exit(1)
}

process_recursively(root).then(() => {
    console.log("Done!");
})
