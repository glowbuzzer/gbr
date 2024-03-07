/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 *
 * This script packages libs/store and libs/controls using esbuild ready to be published to npm.
 *
 * Includes a number of features:
 * - Bundles using esbuild
 * - Updates package.json version
 * - Currently only outputs ESM, but could be adapted to support CJS
 * - Tracks dependencies and will fail if new unexpected dependencies are added, otherwise will bundle or leave external
 * - Generates bundles for submodules, so that they can be imported individually, reducing dependencies for some use cases
 * - Generates typescript declarations
 * - Generates a package.json file, and updates version numbers based on the version in the root package.json
 * - Generates a module.json summary file of submodules and their dependencies
 * - Copies the LICENSE file from the root directory
 *
 */

import {build} from 'esbuild';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import svgrPlugin from "esbuild-plugin-svgr";

// when run as part of the build process, the version number is passed in as an environment variable
const GITHUB_TAG_PREFIX = "refs/tags/";

const [, , p, version_or_github_ref] = process.argv;

if (!p?.length) {
    throw new Error("No list of packages given")
}

if (!version_or_github_ref?.length) {
    throw new Error("No version bump given")
}

const projects = p.split(",")

// figure out if we're running in CI or plain version is given
const version = version_or_github_ref.startsWith(GITHUB_TAG_PREFIX) ? version_or_github_ref.substring(GITHUB_TAG_PREFIX.length) : version_or_github_ref

// this is the root package.json containing authoratitive versions of all dependencies
const master = JSON.parse(fs.readFileSync(`./package.json`).toString())

console.log("Packaging the following projects:", projects.join(","))
console.log("Setting all versions to:", version)

for (const project of projects) {
    console.log(`Processing @glowbuzzer/${project}`)

    // this is the package.json for the project we're building
    const pkg = JSON.parse(fs.readFileSync(`./libs/${project}/package.json`).toString());

    // the exports property defines the submodules
    if (!pkg.exports) {
        throw new Error('Failed to find \'exports\' property in package.json');
    }

    /**
     * This plugin tracks all imports, so that we can report on external dependencies
     * used by each submodule.
     */
    const reportPlugin = () => {
        const imports = new Set()

        return {
            name: "report", setup(build) {
                build.onResolve({filter: /.*/}, args => {
                    if (args.kind !== "entry-point" // this is our entry point (full path)
                        && !args.path.startsWith(".") // this is relative and will be bundled
                        // && !args.path.startsWith("@glowbuzzer/" + project) // ourself (shouldn't really appear)
                        && !args.path.startsWith("@material-symbols")) { // these are svgs which will be bundled by svgr

                        // reduce the path to the package name (eg. @acme/util/some/path -> @acme/util)
                        const scoped = args.path.startsWith("@")
                        const parts = args.path.split("/");
                        const name = scoped ? parts.slice(0, 2).join("/") : parts.slice(0, 1).join("/")
                        imports.add(name)
                    }
                    // don't return anything (esbuild will resolve the path)
                    return undefined
                })
                build.onEnd(result => {
                    // add info to the final output
                    result.imports = Array.from(imports)
                })
            }
        }
    }

    // project pkg.exports defines all the distinct bundles we are going to produce
    const summary = await Promise.all(Object.keys(pkg.exports).map(async (sub_module) => {
        // all bundles must be relative to the project root
        if (!sub_module.startsWith('./') && sub_module !== '.') {
            throw new Error('Expected exported submodule key to start with \'./\' or be \'.\'');
        }

        // construct the entry point (each submodule must have an index.ts)
        const entryPoint = path.resolve(`libs/${project}/src/${sub_module}/index.ts`);

        // these libs will not be bundled and will be included in optional dependencies along with versions from root package.json
        const external_libs = [
            '@glowbuzzer/store',
            // react and redux
            'react', 'react-dom', 'react-redux', '@reduxjs/toolkit', "redux-undo",
            // antd
            'antd', '@ant-design/icons',
            // styles
            'styled-components',
            // dock layout
            'flexlayout-react',
            // robot and toolpath display
            'three', 'three-stdlib', '@react-three/fiber', '@react-three/drei',
            // telemetry tile
            'd3',
            // gcode editor
            'ace-builds', 'react-ace',
            // dseg font css (no code), but not sure we can bundle
            'dseg',
            // don't bundle the occt-import-js code (TODO not currently referenced)
            'occt-import-js'
        ];

        // these libs will be bundled
        const bundled_libs = [
            'fast-deep-equal' // tiny so we will bundle it
        ]

        const options = {
            entryPoints: [entryPoint],
            bundle: true,
            sourcemap: true,
            external: external_libs, // won't be bundled
            platform: 'browser',
            target: 'es2020',
            treeShaking: true,
            metafile: true,
            plugins: [
                svgrPlugin({namedExport: "ReactComponent", exportType: "named"}),
                reportPlugin()
            ],
            outdir: `dist/${project}/${sub_module}`,
            outExtension: {'.js': '.mjs'},
            format: 'esm'
        };

        // invoke esbuild to create the bundle
        const {metafile, imports} = await build(options)

        for (const item of imports) {
            // check that no new depenendencies have crept in!
            if (!external_libs.includes(item) && !bundled_libs.includes(item)) {
                // try and figure out where the import is coming from and its size (and transitive dependencies)
                const candidates = Object.entries(metafile.inputs)
                    .filter(([i]) => i.startsWith("node_modules") && !i.endsWith(".svg"))
                    .map(([p, info]) => `  ${p}, size ${info.bytes}, imports ${info.imports.join(", ")}`)

                console.log("Unexpected import:", item)
                if (candidates.length) {
                    console.log("Candidates:")
                    console.log(candidates.join("\n"))
                }
                process.exit(1)
            }
        }

        // the metafile.outputs contains two entries: the bundled js and the map file
        // we want the js file entry because it contains all the exports and we're going to report on these
        const k = Object.keys(metafile.outputs).filter(k => !k.endsWith(".map"))[0]
        const output = metafile.outputs[k];

        const import_path = "@glowbuzzer/" + project + (sub_module === "." ? "" : "/" + sub_module.substring(2))
        return {
            module: sub_module,
            import: import_path,
            dependencies: imports
                .filter(p => !bundled_libs.includes(p)) // don't list bundled libs in dependencies
                .filter(p => !pkg.dependencies?.[p]) // don't list hard dependencies from project's package.json
                .sort(),
            exports: output.exports.sort()
        }
    }))

    // write out the summary file
    fs.writeFileSync(`dist/${project}/modules.json`, JSON.stringify(summary, null, 2));

    // produce the typescript declaration files and move to package directory, and merge in the typescript definitions
    execSync(`tsc --build libs/${project}/tsconfig.lib.json`, {stdio: 'inherit'})
    execSync(`cp -R dist/types/libs/${project}/src/* dist/${project}`, {stdio: 'inherit'})
    // copy readme and licence files
    execSync(`cp libs/${project}/README.md dist/${project}`, {stdio: 'inherit'})
    execSync(`cp LICENSE dist/${project}`, {stdio: 'inherit'})

    // if we're building multiple projects (ie. controls and store, which we normally are), ensure versions are all in sync
    for (const dep of projects) {
        const key = `@glowbuzzer/${dep}`;
        if (pkg.dependencies?.[key]) {
            pkg.dependencies[key] = version
        }
    }

    // add all external dependencies to optionalDependencies, taking the version from the root package.json
    pkg.optionalDependencies = Object.fromEntries([
        ...new Set(summary.map(s => s.dependencies).flat()) // flatten and remove duplicates
    ].filter(d => !pkg.dependencies?.[d]).map(d => {
        const version = master.dependencies[d]
        if (!version) {
            throw new Error("Failed to find dependency version for: " + d)
        }
        return [d, version];
    }))

    // finally fill in the exports with path to the bundled index file for each sub-module
    const exports = Object.fromEntries(summary.map(s => {
        const relpath = s.module === '.' ? '' : (s.module.substring(2) + '/');
        return [s.module, {
            import: `./${relpath}index.mjs`
            // import: {
            //     types: `./types/${relpath}index.d.ts`,
            //     default: `./${relpath}index.mjs`
            // }
        }];
    }))

    fs.writeFileSync(`dist/${project}/package.json`, JSON.stringify({
        ...pkg,
        version,
        license: 'MIT',
        // types: "types/index.d.ts",
        exports
    }, null, 2));
}
