# Unit tests for the GBC API

The tests in this sub-project exercise some of the frontend Typescript code but more importantly large parts of GBC.

Running the tests is a bit convoluted...

> **Important** The build/run instructions assume you have `gbc` and `gbr`
> projects alongside each other in your directory tree

1. In the `gbr` project run `node build.mjs --watch`.

   This will compile and watch the Typescript sources using `esbuild`. The output is placed in `gbc/libs/gbc-node/build`


3. In the `gbc` project, cd to `libs/gbc-node` and run `pnpm i` to install node modules. You should now be able to run
   the tests. If available, use the `gbc-node (tests)` run configuration. This has the following settings:

```
Target: gbc-node
Executable: node (for example, on Ubuntu use /usr/bin/node)
Arguments: --enable-source-maps build/index.js
Working directory: $ProjectFileDir$\libs\gbc-node
```

To restrict tests to a specific area, use `--suite <name>` in the run configuration.

To restrict to a single test within a test suite, using `test.only` (part of `uvu`).

The build script supports `--watch` and `--outfile` options.
