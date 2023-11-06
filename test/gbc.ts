/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { GbcTest } from "./src/framework"
import { Command } from "commander"

const program = new Command()

program
    .option("-p, --plot", "whether to output plot files")
    .option("-s, --suite <suite>", "suite to run")
    .option("-l, --lib <gbc_lib_path>", "path to gbc node add-in")

program.parse(process.argv)
const { lib, plot } = program.opts()

const req = require
const addon = req(lib && lib.startsWith("/") ? lib : `../../../${lib}/libs/gbc-node/gbc-node.node`)

export const gbc = new GbcTest(addon, plot)
