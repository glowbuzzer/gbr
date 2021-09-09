# Unit tests for the GBC API

The tests in this sub-project exercise some of the frontend Typescript code but 
more importantly large parts of GBC.

Running the tests is a bit convoluted...

> **Important** The build/run instructions assume you have `monorepo` and `frontend` 
> projects along side each other in your directory tree, and that you are using WSL as
> your toolchain

1. In the `frontend` project run `node build.js`.

    This will compile and watch the Typescript sources using `esbuild`.
The output is placed in `monorepo/libs/gbc-node/build`


2. In the `monorepo` project, run the `gbc-node (tests)` run configuration 
(this coniguration is stored as a project file in the `.run` folder)

The esbuild test code (with `store` project bundled) is on your local machine, so the steps above
only work if you are using WSL as your toolchain, so that the node add-on and esbuild output are
in the same location.

To restrict tests to a specific area, use `--suite <name>` in the run configuration.

To restrict to a single test within a test suite, using `test.only` (part of `uvu`).
