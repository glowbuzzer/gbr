/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {build} from 'esbuild';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

const GITHUB_TAG_PREFIX = "refs/tags/";

const [, , p, version_or_github_ref] = process.argv;

if (!p?.length) {
    throw new Error("No list of packages given")
}

if (!version_or_github_ref?.length) {
    throw new Error("No version bump given")
}

const projects = p.split(",")

const version = version_or_github_ref.startsWith(GITHUB_TAG_PREFIX) ? version_or_github_ref.substring(GITHUB_TAG_PREFIX.length) : version_or_github_ref

const master = JSON.parse(fs.readFileSync(`./package.json`).toString())

console.log("Packaging the following projects:", projects.join(","))
console.log("Setting all versions to:", version)

for (const project of projects) {
    console.log("Processing", project)
    const pkg = JSON.parse(fs.readFileSync(`./libs/${project}/package.json`).toString());
    if (!pkg.exports) {
        throw new Error('Failed to find \'exports\' property in package.json');
    }

    const exports = {};

    await Promise.all(Object.keys(pkg.exports).map((sub_module) => {
        if (!sub_module.startsWith('./') && sub_module !== '.') {
            throw new Error('Expected exported submodule key to start with \'./\' or be \'.\'');
        }

        const index = sub_module === './';

        const entryPoint = path.resolve(`libs/${project}/src/${sub_module}/index.ts`);
        // console.log('Processing', entryPoint);
        const common_options = {
            entryPoints: [entryPoint],
            bundle: !index,
            // outfile: "dist/controls/index.mjs",
            // minify: true,
            sourcemap: true,
            // format: 'cjs',
            external: index ? undefined : [
                '@glowbuzzer/store',
                // core
                'react', 'react-dom', 'react-reconciler',
                'react-redux', '@reduxjs/toolkit',
                'antd', '@ant-design/icons',
                'styled-components',
                // currently core but am not a huge fan
                'react-grid-layout',
                // required for robot and toolpath display
                'three', 'three-stdlib', '@react-three/fiber', '@react-three/drei',
                // required for telemetry tile
                'd3',
                // required for gcode editor
                'ace-builds', 'react-ace',
                // dseg font css (no code), but not sure we can bundle
                'dseg'

                ///// following add approx 30k to bundle unminified and can prob be included
                // 'react-is',
                // '@babel/runtime',
                // 'fast-deep-equal', 'lodash.isequal',
                // '@loadable/component', '@react-three/drei',
            ],

            platform: 'browser',
            target: 'es6',
            treeShaking: true,
            // logLevel: "info",
            metafile: true,
            // define: {
            //     'process.env.NODE_ENV': '"production"'
            // },
            loader: {
                // '.png': 'dataurl',
                '.woff': 'file',
                '.woff2': 'file',
                '.eot': 'file',
                '.ttf': 'file'
                // '.svg': 'dataurl'
            }
        };
        const sub_builds = [
            {
                ...common_options,
                outdir: `dist/${project}/esm/${sub_module}`,
                outExtension: {'.js': '.mjs'},
                format: 'esm'
            },
            {
                ...common_options,
                outdir: `dist/${project}/${sub_module}`,
                format: 'cjs'
            }
        ];
        exports[sub_module] = {
            'require': `${sub_module}/index.js`,
            'import': `./esm/${sub_module === '.' ? '' : (sub_module.substr(2) + '/')}index.mjs`
        };
        return Promise.all(sub_builds.map(options => build(options).then(r => {
            const meta = r.metafile;
            const external_libs = Object.entries(meta.inputs).filter(l => !l[0].startsWith('libs'));
            external_libs.sort((a, b) => b[1].bytes - a[1].bytes);
            // const m = Object.fromEntries(external_libs);
            // just report the biggest 50 imports
            // console.log(external_libs.slice(0, 50).map(lib => [lib[0], lib[1].bytes]).map(l => l.join(', size:')).join('\n'));

            // const external = external_libs.reduce((total, c) => total + c[1].bytes, 0);
            // console.log('Totals for', options.entryPoints[0], 'external=', external, 'count=', external_libs.length);
        })));
    })).then(() => {
        execSync(`tsc --build libs/${project}/tsconfig.lib.json`)
        execSync(`mv dist/types/libs/${project}/src dist/${project}/types`)

        // re-write dependencies between included packages so everything uses new version
        for (const dep of projects) {
            const key = `@glowbuzzer/${dep}`;
            if (pkg.dependencies?.[key]) {
                pkg.dependencies[key] = version
            }
        }
        // fill dependency versions from those we have in the top-level project
        // noinspection JSCheckFunctionSignatures
        pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).map(([name, version]) => {
            if (version !== "auto") {
                return [name, version]
            }
            const auto = master.dependencies[name]
            if (!auto) {
                throw new Error("Failed to find master dependency version for: " + name)
            }
            return [name, auto]
        }))
        fs.writeFileSync(`dist/${project}/package.json`, JSON.stringify({
            ...pkg,
            version,
            types: "types/index.d.ts",
            exports
        }, null, 2));
    })
}
