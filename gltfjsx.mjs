/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 *
 * This script processes GLB model files by:
 * 1. Transforming (optimizing) the input GLB files
 * 2. Either:
 *    - Converting them to TypeScript files with base64-encoded content (default)
 *    - Keeping the transformed GLB files (when --keep-glb flag is used)
 *
 * Usage: node gltfjsx.mjs [--keep-glb] <input directory/file> <output directory>
 */

import transform from "gltfjsx/src/utils/transform.js"
import fs from "fs"
import path from "path"

// Parse command line arguments
const args = process.argv.slice(2)
let keepGlb = false
let inputDir, outputDir

// Check for --keep-glb flag
// When this flag is set, the script will:
// 1. Skip generating TypeScript files with base64-encoded content
// 2. Keep the transformed GLB files and copy them to the output directory
if (args.includes("--keep-glb")) {
    keepGlb = true
    // Remove the flag from args to properly extract input and output directories
    const flagIndex = args.indexOf("--keep-glb")
    args.splice(flagIndex, 1)
}

;[inputDir, outputDir] = args

// Show usage if arguments are missing
if (!inputDir?.length || !outputDir?.length) {
    console.log("Usage: node gltfjsx.mjs [--keep-glb] <input directory/file> <output directory>")
    console.log("Options:")
    console.log("  --keep-glb    Keep the transformed GLB file instead of generating TypeScript")
    process.exit(1)
}

// Check if input path exists
if (!fs.existsSync(inputDir)) {
    console.log(`Input path '${inputDir}' does not exist!`)
    process.exit(1)
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

function output_paths(file) {
    const { name } = path.parse(file)
    const glb = path.join(path.dirname(file), name + "-transformed.glb").replace(/\\/g, "/")
    const ts = path.join(outputDir, name + ".ts").replace(/\\/g, "/")

    return {
        name,
        glb,
        ts
    }
}

/**
 * Process a single GLB file
 *
 * This function:
 * 1. Transforms (optimizes) the input GLB file
 * 2. Either:
 *    - Copies the transformed GLB file to the output directory (if keepGlb flag is set)
 *    - Creates a TypeScript file with base64-encoded content (default behavior)
 * 3. Cleans up temporary files
 *
 * @param {string} file - Path to the input GLB file
 */
async function process_file(file) {
    const { glb, ts } = output_paths(file)

    // transform (optimise) the input gltf/glb file
    // (note that this must not be compressed using draco!)
    await transform(file, glb, {})

    if (keepGlb) {
        // If keepGlb flag is set, keep the transformed GLB file as the output
        // Copy the transformed file to the output directory with the same filename
        const outputGlb = path.join(outputDir, path.basename(glb)).replace(/\\/g, "/")
        fs.copyFileSync(glb, outputGlb)
        console.log(`Processed: ${file} -> ${outputGlb}`)
    } else {
        // Default behavior: create TypeScript file with base64-encoded content
        // This allows the model to be imported directly in TypeScript/JavaScript
        const data = fs.readFileSync(glb)
        fs.writeFileSync(ts, `export default "${data.toString("base64")}"`)
        console.log(`Processed: ${file} -> ${ts}`)
    }

    // Always delete the temporary transformed file from its original location
    fs.unlinkSync(glb)
}

async function process_directory(dir) {
    const files = fs.readdirSync(dir)
    const filePromises = []

    for (const file of files) {
        const full_path = path.join(dir, file)
        const stat = fs.statSync(full_path)

        // Only process files, not subdirectories
        if (!stat.isDirectory()) {
            // Only process .glb files
            if (path.extname(full_path).toLowerCase() === ".glb") {
                filePromises.push(process_file(full_path))
            }
        }
    }

    return Promise.all(filePromises)
}

// Check if input is a file or directory
const inputStat = fs.statSync(inputDir)
if (inputStat.isFile()) {
    // Process single file
    if (path.extname(inputDir).toLowerCase() === ".glb") {
        process_file(inputDir).then(() => {
            console.log("Done!")
        })
    } else {
        console.log(`Input file '${inputDir}' is not a GLB file!`)
        process.exit(1)
    }
} else {
    // Process directory
    process_directory(inputDir).then(() => {
        console.log("Done!")
    })
}
