/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Command } from "commander"
import * as all_suites from "./src/all_tests"

const program = new Command()

program
    .option("-p, --plot", "whether to output plot files")
    .option("-s, --suite <suite>", "suite to run")
    .option("-l, --lib <gbc_lib_path>", "path to gbc node add-in")

program.parse(process.argv)
const { suite: suites } = program.opts()
const suites_to_run = suites ? suites.split(",").map(s => s.trim()) : Object.keys(all_suites)

for (const [name, runner] of Object.entries(all_suites)) {
    if (suites_to_run.includes(name)) {
        runner.run()
    }
}
